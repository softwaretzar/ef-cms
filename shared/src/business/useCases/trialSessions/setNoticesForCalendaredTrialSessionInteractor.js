const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { PDFDocument } = require('pdf-lib');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.caseId optional caseId to explicitly set the notice on the ONE specified case
 * @returns {Promise} the promises for the updateCase calls
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async ({
  applicationContext,
  caseId,
  trialSessionId,
}) => {
  let shouldSetNoticesIssued = true;
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  // opting to pull from the set of calendared cases rather than load the
  // case individually to add an additional layer of validation
  if (caseId) {
    // Do not set when sending notices for a single case
    shouldSetNoticesIssued = false;

    const singleCase = calendaredCases.find(
      caseRecord => caseRecord.caseId === caseId,
    );

    calendaredCases = [singleCase];
  }

  if (calendaredCases.length === 0) {
    return;
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const newPdfDoc = await PDFDocument.create();

  /**
   * generates a notice of trial session and adds to the case
   *
   * @param {object} caseRecord the case data
   * @returns {object} the raw case object
   */
  const setNoticeForCase = async caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });
    const { procedureType } = caseRecord;

    // Notice of Trial Issued
    const noticeOfTrialIssuedFile = await applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    const newNoticeOfTrialIssuedDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: noticeOfTrialIssuedFile,
      documentId: newNoticeOfTrialIssuedDocumentId,
    });

    const trialSessionStartDate = applicationContext
      .getUtilities()
      .formatDateString(trialSession.startDate, 'MMDDYYYY');

    const noticeOfTrialDocumentTitle = `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`;

    const noticeOfTrialDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newNoticeOfTrialIssuedDocumentId,
        documentTitle: noticeOfTrialDocumentTitle,
        documentType: Document.NOTICE_OF_TRIAL.documentType,
        eventCode: Document.NOTICE_OF_TRIAL.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(noticeOfTrialDocument);
    caseEntity.setNoticeOfTrialDate();

    // Standing Pretrial Notice/Order
    let standingPretrialFile;
    let standingPretrialDocumentTitle;
    let standingPretrialDocumentEventCode;

    if (procedureType === 'Small') {
      // Generate Standing Pretrial Notice
      standingPretrialFile = await applicationContext
        .getUseCases()
        .generateStandingPretrialNoticeInteractor({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
        });

      standingPretrialDocumentTitle = 'Standing Pretrial Notice';
      standingPretrialDocumentEventCode = 'SPTN';
    } else {
      // Generate Standing Pretrial Order
      standingPretrialFile = await applicationContext
        .getUseCases()
        .generateStandingPretrialOrderInteractor({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          trialSessionId: trialSessionEntity.trialSessionId,
        });

      standingPretrialDocumentTitle = 'Standing Pretrial Order';
      standingPretrialDocumentEventCode = 'SPTO';
    }

    const newStandingPretrialDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: standingPretrialFile,
      documentId: newStandingPretrialDocumentId,
    });

    const standingPretrialDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newStandingPretrialDocumentId,
        documentTitle: standingPretrialDocumentTitle,
        documentType: standingPretrialDocumentTitle,
        eventCode: standingPretrialDocumentEventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(standingPretrialDocument);

    // Serve notice
    const servedParties = await serveNoticesForCase(
      caseEntity,
      noticeOfTrialDocument,
      noticeOfTrialIssuedFile,
    );

    noticeOfTrialDocument.setAsServed(servedParties.all);

    const rawCase = caseEntity.validate().toRawObject();
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: rawCase,
    });

    return rawCase;
  };

  /**
   * serves a notice of trial session and standing pretrial document on electronic
   * recipients and generates paper notices for those that get paper service
   *
   * @param {object} caseEntity the case entity
   * @param {object} noticeDocumentEntity the notice document entity
   * @param {Uint8Array} noticeDocumentPdfData the pdf data of the notice doc
   * @param {object} standingPretrialDocumentEntity the standing pretrial document entity
   * @param {Uint8Array} standingPretrialPdfData the pdf data of the standing pretrial doc
   * @returns {object} sends service emails and updates `newPdfDoc` with paper service pages for printing returning served servedParties
   */
  const serveNoticesForCase = async (
    caseEntity,
    noticeDocumentEntity,
    noticeDocumentPdfData,
    standingPretrialDocumentEntity,
    standingPretrialPdfData,
  ) => {
    const servedParties = aggregatePartiesForService(caseEntity);

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: noticeDocumentEntity,
      servedParties,
    });

    await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
      applicationContext,
      caseEntity,
      documentEntity: standingPretrialDocumentEntity,
      servedParties,
    });

    if (servedParties.paper.length > 0) {
      const combinedDocumentsPdf = await PDFDocument.create();
      const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);
      const standingPretrialPdf = await PDFDocument.load(
        standingPretrialPdfData,
      );

      let copiedPages = await combinedDocumentsPdf.copyPages(
        noticeDocumentPdf,
        noticeDocumentPdf.getPageIndices(),
      );

      copiedPages = copiedPages.concat(
        await combinedDocumentsPdf.copyPages(
          standingPretrialPdf,
          standingPretrialPdf.getPageIndices(),
        ),
      );

      copiedPages.forEach(page => {
        combinedDocumentsPdf.addPage(page);
      });

      await applicationContext
        .getUseCaseHelpers()
        .appendPaperServiceAddressPageToPdf({
          applicationContext,
          caseEntity,
          newPdfDoc,
          noteiceDoc: combinedDocumentsPdf,
          servedParties,
        });
    }

    return servedParties;
  };

  for (var calendaredCase of calendaredCases) {
    await setNoticeForCase(calendaredCase);
  }

  // Prevent from being overwritten when generating notices for a manually-added
  // case, after the session has been set (see above)
  if (shouldSetNoticesIssued) {
    await trialSessionEntity.setNoticesIssued();

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });
  }

  if (newPdfDoc.getPages().length) {
    const paperServicePdfData = await newPdfDoc.save();
    const paperServicePdfBuffer = Buffer.from(paperServicePdfData);

    return paperServicePdfBuffer;
  }
};
