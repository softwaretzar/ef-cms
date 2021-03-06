const {
  InvalidEntityError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors/errors');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to recall
 * @returns {object} the updated case after it has been recalled
 */
exports.recallPetitionFromIRSHoldingQueueInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError(
      'Unauthorized for recall from IRS Holding Queue',
    );
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseRecord) throw new NotFoundError(`Case ${caseId} was not found`);

  const caseEntity = new Case(caseRecord, {
    applicationContext,
  }).validate();

  const petitionDocument = caseEntity.documents.find(
    document =>
      document.documentType ===
      Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
  );

  const initializeCaseWorkItem = petitionDocument.workItems.find(
    workItem => workItem.isInitializeCase,
  );

  let workItemsUpdated = [];
  for (let workItem of caseEntity.getWorkItems()) {
    workItem.setStatus(Case.STATUS_TYPES.recalled);
    workItemsUpdated.push(
      applicationContext.getPersistenceGateway().updateWorkItem({
        applicationContext,
        workItemToUpdate: workItem.toRawObject(),
      }),
    );
  }
  await Promise.all(workItemsUpdated);

  if (initializeCaseWorkItem) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: initializeCaseWorkItem,
    });

    initializeCaseWorkItem.recallFromIRSBatchSystem({
      applicationContext,
      user,
    });
    const invalidEntityError = new InvalidEntityError(
      'Invalid for recall from IRS',
    );
    caseEntity.validateWithError(invalidEntityError);

    caseEntity
      .recallFromIRSHoldingQueue()
      .validateWithError(invalidEntityError);

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.toRawObject(),
    });

    const batchedMessage = initializeCaseWorkItem.messages.find(
      message => message.message === 'Petition batched for IRS',
    );

    const { fromUserId } = batchedMessage;
    const { createdAt } = initializeCaseWorkItem;

    await applicationContext.getPersistenceGateway().updateWorkItem({
      applicationContext,
      workItemToUpdate: initializeCaseWorkItem.toRawObject(),
    });

    await Promise.all([
      applicationContext.getPersistenceGateway().deleteUserOutboxRecord({
        applicationContext,
        createdAt,
        userId: fromUserId,
      }),
      applicationContext.getPersistenceGateway().deleteSectionOutboxRecord({
        applicationContext,
        createdAt,
        section: 'petitions',
      }),
      applicationContext.getPersistenceGateway().createUserInboxRecord({
        applicationContext,
        workItem: initializeCaseWorkItem,
      }),
      applicationContext.getPersistenceGateway().createSectionInboxRecord({
        applicationContext,
        workItem: initializeCaseWorkItem,
      }),
    ]);

    return caseEntity.toRawObject();
  } else {
    throw new NotFoundError(
      `Petition workItem for Case ${caseId} was not found`,
    );
  }
};
