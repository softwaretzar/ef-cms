import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { IRS_BATCH_SYSTEM_SECTION } from '../../../../shared/src/business/entities/WorkQueue';
import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import {
  formatWorkItem,
  formattedWorkQueue as formattedWorkQueueComputed,
  getWorkItemDocumentLink,
} from './formattedWorkQueue';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let globalUser;

applicationContext.getCurrentUser = () => {
  return globalUser;
};

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed, {
  ...applicationContext,
});

const petitionsClerkUser = {
  role: User.ROLES.petitionsClerk,
  section: 'petitions',
  userId: 'abc',
};

const docketClerkUser = {
  role: User.ROLES.docketClerk,
  section: 'docket',
  userId: 'abc',
};

const getBaseState = user => {
  globalUser = user;
  return {
    permissions: getUserPermissions(user),
  };
};

const FORMATTED_WORK_ITEM = {
  assigneeId: 'abc',
  assigneeName: 'Unassigned',
  caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
  caseStatus: Case.STATUS_TYPES.generalDocket,
  createdAtFormatted: '12/27/18',
  currentMessage: {
    createdAtFormatted: '12/27/18',
    from: 'Test Respondent',
    fromUserId: 'respondent',
    message: 'Answer filed by respondent is ready for review',
    messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    to: 'Unassigned',
  },
  docketNumber: '101-18',
  document: {
    attachments: true,
    documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
    documentType: 'Answer',
  },
  historyMessages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  isCourtIssuedDocument: false,
  messages: [
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Respondent',
      fromUserId: 'respondent',
      message: 'Answer filed by respondent is ready for review',
      messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
    {
      createdAtFormatted: '12/27/18',
      from: 'Test Docketclerk',
      fromUserId: 'docketclerk',
      message: 'a message',
      messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      to: 'Unassigned',
    },
  ],
  section: 'petitions',
  selected: true,
  sentBy: 'respondent',
  showComplete: true,
  showSendTo: true,
  workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
};

describe('formatted work queue computed', () => {
  const workItem = {
    assigneeId: 'abc',
    assigneeName: null,
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: Case.STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketNumber: '101-18',
    document: {
      attachments: true,
      createdAt: '2018-12-27T18:05:54.164Z',
      documentId: '8eef49b4-9d40-4773-84ab-49e1e59e49cd',
      documentType: 'Answer',
    },
    isQC: false, // not in QC state - should not show in QC boxes
    messages: [
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Respondent',
        fromUserId: 'respondent',
        message: 'Answer filed by respondent is ready for review',
        messageId: '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
      {
        createdAt: '2018-12-27T18:05:54.164Z',
        from: 'Test Docketclerk',
        fromUserId: 'docketclerk',
        message: 'a message',
        messageId: '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
      },
    ],
    section: 'petitions',
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };
  const qcWorkItem = {
    ...workItem,
    isQC: true, // in QC state - should show in QC boxes
    section: 'docket',
  };

  it('formats the workitems for my inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0]).toMatchObject(FORMATTED_WORK_ITEM);
  });

  it('formats the workitems for section inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0]).toMatchObject(FORMATTED_WORK_ITEM);
  });

  it('should set isCourtIssuedDocument to true for a court-issued document in the selected work item', () => {
    const workItemCopy = cloneDeep(workItem);
    workItemCopy.document.documentType = 'O - Order';
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItemCopy],
        workQueue: [workItemCopy],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result2[0].isCourtIssuedDocument).toEqual(true);
  });

  it('adds a currentMessage', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0].currentMessage.messageId).toEqual(
      '09eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('adds a historyMessages array without the current message', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [workItem],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result[0].historyMessages.length).toEqual(1);
    expect(result[0].historyMessages[0].messageId).toEqual(
      '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1',
    );
  });

  it('sets showSendTo and showComplete to false when isInitializeCase is true', () => {
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showSendTo).toBeFalsy();
    expect(result2[0].showComplete).toBeFalsy();
  });
  it('sets showBatchedStatusIcon to false when caseStatus is NOT batchedForIRS', () => {
    // workItem.caseStatus is generalDocket
    workItem.isInitializeCase = true;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeFalsy();
  });
  it('sets showBatchedStatusIcon to true when caseStatus is batchedForIRS', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = Case.STATUS_TYPES.batchedForIRS;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showBatchedStatusIcon).toBeTruthy();
  });

  it('sets showBatchedStatusIcon to recalled', () => {
    workItem.isInitializeCase = true;
    workItem.caseStatus = Case.STATUS_TYPES.recalled;
    const result2 = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });
    expect(result2[0].showRecalledStatusIcon).toBeTruthy();
    expect(result2[0].showUnreadIndicators).toEqual(true);
  });

  it('filters the workitems for section QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [qcWorkItem],
        workQueue: [qcWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [qcWorkItem],
        workQueue: [qcWorkItem],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for section QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...qcWorkItem, inProgress: true }],
        workQueue: [{ ...qcWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC in progress', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [{ ...qcWorkItem, inProgress: true }],
        workQueue: [{ ...qcWorkItem, inProgress: true }],
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for section batched', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
          },
        ],
        workQueueToDisplay: {
          box: 'batched',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      section: IRS_BATCH_SYSTEM_SECTION,
    });
  });

  it('filters the workitems for my batched', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
            sentByUserId: petitionsClerkUser.userId,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            caseStatus: Case.STATUS_TYPES.batchedForIRS,
            section: IRS_BATCH_SYSTEM_SECTION,
            sentByUserId: petitionsClerkUser.userId,
          },
        ],
        workQueueToDisplay: {
          box: 'batched',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      caseStatus: Case.STATUS_TYPES.batchedForIRS,
      section: IRS_BATCH_SYSTEM_SECTION,
    });
  });

  it('should not show a workItem in user messages outbox if it is completed', () => {
    workItem.completedAt = '2019-06-17T15:27:55.801Z';

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result).toEqual([]);
  });

  it('should not show a workItem in section messages outbox if it is completed', () => {
    workItem.completedAt = '2019-06-17T15:27:55.801Z';

    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(petitionsClerkUser),
        selectedWorkItems: [],
        workQueue: [workItem],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      },
    });

    expect(result).toEqual([]);
  });

  it('filters the workitems for section QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          { ...qcWorkItem, completedAt: '2019-06-17T15:27:55.801Z' },
        ],
        workQueue: [{ ...qcWorkItem, completedAt: '2019-06-17T15:27:55.801Z' }],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('filters the workitems for my QC outbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        selectedWorkItems: [
          {
            ...qcWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueue: [
          {
            ...qcWorkItem,
            completedAt: '2019-06-17T15:27:55.801Z',
            completedByUserId: docketClerkUser.userId,
          },
        ],
        workQueueToDisplay: {
          box: 'outbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0]).toMatchObject({
      ...FORMATTED_WORK_ITEM,
      section: 'docket',
    });
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            highPriority: false,
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: true,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
            trialDate: '2019-01-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: true,
            id: 'a',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            highPriority: false,
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0].id).toEqual('b');
    expect(result[1].id).toEqual('a');
    expect(result[2].id).toEqual('c');
    expect(result[3].id).toEqual('d');
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            highPriority: true,
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: true,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
            trialDate: '2019-02-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: true,
            id: 'a',
            receivedAt: '2019-01-17T15:27:55.801Z',
            trialDate: '2019-01-17T00:00:00.000Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0].id).toEqual('a');
    expect(result[1].id).toEqual('c');
    expect(result[2].id).toEqual('b');
    expect(result[3].id).toEqual('d');
  });

  it('sorts high priority work items to the start of the list - qc, my, inbox', () => {
    const result = runCompute(formattedWorkQueue, {
      state: {
        ...getBaseState(docketClerkUser),
        workQueue: [
          {
            ...qcWorkItem,
            assigneeId: docketClerkUser.userId,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '101-19',
            id: 'c',
            receivedAt: '2019-01-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '102-19',
            highPriority: false,
            id: 'b',
            receivedAt: '2019-02-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '103-19',
            highPriority: false,
            id: 'a',
            receivedAt: '2019-03-17T15:27:55.801Z',
          },
          {
            ...qcWorkItem,
            completedByUserId: docketClerkUser.userId,
            docketNumber: '104-19',
            id: 'd',
            receivedAt: '2019-04-17T15:27:55.801Z',
          },
        ],
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      },
    });

    expect(result[0].id).toEqual('c');
    expect(result[1].id).toEqual('b');
    expect(result[2].id).toEqual('a');
    expect(result[3].id).toEqual('d');
  });

  describe('getWorkItemDocumentLink', () => {
    const baseWorkItem = {
      assigneeId: null,
      assigneeName: null,
      caseId: 'fa73b4ed-4b3d-43b3-b704-8b2af5bdecc1',
      caseStatus: 'New',
      caseTitle: 'Ori Petersen',
      createdAt: '2019-12-16T16:48:02.889Z',
      docketNumber: '114-19',
      docketNumberSuffix: 'S',
      sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
      updatedAt: '2019-12-16T16:48:02.889Z',
      workItemId: '36f228c6-0ae5-4adf-aa44-35905b7fc8bd',
    };
    const baseDocument = {
      createdAt: '2019-12-16T16:48:02.888Z',
      documentId: '6db35185-2445-4952-9449-5479a5cadab0',
      filedBy: 'Petr. Ori Petersen',
      partyPrimary: true,
      partySecondary: false,
      processingStatus: 'complete',
      receivedAt: '2019-12-16T16:48:02.888Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };
    const baseMessage = {
      createdAt: '2019-12-16T16:48:02.889Z',
      from: 'Test Petitioner',
      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'Petition filed by Ori Petersen is ready for review.',
      messageId: '9ad0fceb-41be-4902-8294-9f505fb7a353',
    };

    it('should return editLink as default document detail page if document is petition and user is petitionsclerk viewing a QC box (workQueueIsInternal=false)', () => {
      const permissions = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'Petition',
            eventCode: 'P',
            pending: false,
          },
          isInitializeCase: true,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'petitions',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('');
    });

    it('should return /edit-court-issued if document is court-issued and not served and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'OAJ - Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'petitions',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit-court-issued');
    });

    it('should return editLink as default document detail page if document is court-issued and not served and user is petitionsclerk viewing a QC box (workQueueIsInternal=false)', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            documentType: 'OAJ - Order that case is assigned',
            eventCode: 'OAJ',
            pending: false,
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('');
    });

    it('should return /complete if document is in progress and user is docketclerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/complete');
    });

    it('should return default edit link if document is in progress and user is petitionsClerk', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            isFileAttached: false,
            isPaper: true,
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inProgress',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('');
    });

    it("should return /edit if document is an external doc that has not been qc'd (isQC is true) and user is docketclerk", () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit');
    });

    it("should return editLink with a direct link to the message if document is an external doc that has not been qc'd (isQC is true) and user is petitionsClerk and viewing a messages box (workQueueIsInternal=true)", () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'section',
          workQueueIsInternal: true,
        },
      });
      expect(result).toEqual('/messages/9ad0fceb-41be-4902-8294-9f505fb7a353');
    });

    it('should return editLink with message id to mark as read if the box is my inbox and user is petitionsClerk viewing a messages box (workQueueIsInternal=true)', () => {
      const { permissions } = getBaseState(petitionsClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: true,
        },
      });
      expect(result).toEqual(
        '/messages/9ad0fceb-41be-4902-8294-9f505fb7a353/mark/36f228c6-0ae5-4adf-aa44-35905b7fc8bd',
      );
    });

    it('should return editLink as /edit if the box is my inbox and user is docketClerk', () => {
      const { permissions } = getBaseState(docketClerkUser);

      const result = getWorkItemDocumentLink({
        applicationContext,
        permissions,
        workItem: {
          ...baseWorkItem,
          document: {
            ...baseDocument,
            category: 'Miscellaneous',
            documentTitle: 'Administrative Record',
            documentType: 'Administrative Record',
            eventCode: 'ADMR',
            pending: false,
            receivedAt: '2018-01-01',
            relationship: 'primaryDocument',
            scenario: 'Standard',
          },
          isInitializeCase: false,
          isQC: true, // in QC state - should show in QC boxes
          messages: [baseMessage],
          section: 'docket',
        },
        workQueueToDisplay: {
          box: 'inbox',
          queue: 'my',
          workQueueIsInternal: false,
        },
      });
      expect(result).toEqual('/edit');
    });
  });

  describe('formatWorkItem', () => {
    it('should return createdAtFormatted as MMDDYY format', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        createdAt: '2019-02-28T21:14:39.488Z',
        createdAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.createdAtFormatted).toEqual('02/28/19');
    });

    it('should coerce the value of highPriority to a boolean', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: 1,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.highPriority).toEqual(true);

      workItem.highPriority = undefined;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.highPriority).toEqual(false);
    });

    it('should capitalize sentBySection', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        sentBySection: 'section',
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.sentBySection).toEqual('Section');
    });

    it('should return completedAtFormatted as DATE_TIME format', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: '2019-02-28T21:14:39.488Z',
        completedAtFormatted: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormatted).toEqual('02/28/19 04:14 pm');
    });

    it('should return completedAtFormattedTZ as DATE_TIME_TZ format', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        completedAt: '2019-02-28T21:14:39.488Z',
        completedAtFormattedTZ: undefined,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.completedAtFormattedTZ).toEqual('02/28/19 4:14 pm ET');
    });

    it('should return assigneeName as "Unassigned" when assigneeName is falsy', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        assigneeName: '',
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.assigneeName).toEqual('Unassigned');
    });

    it('should show the high priority when the work item is high priority', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: false,
        showHighPriorityIcon: undefined,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showHighPriorityIcon).toEqual(undefined);

      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showHighPriorityIcon).toEqual(true);
    });

    it('should show unread indicators when the work item is unread', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        isRead: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadIndicators).toEqual(true);

      workItem.isRead = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadIndicators).toEqual(false);
    });

    it('should show unread status icon when the work item is unread and not high priority', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        highPriority: false,
        isRead: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(true);

      workItem.isRead = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(false);

      workItem.isRead = false;
      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnreadStatusIcon).toEqual(false);
    });

    it('should set showComplete and showSendTo to true when isInitializeCase is false', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        isInitializeCase: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showComplete).toEqual(true);
      expect(result.showSendTo).toEqual(true);

      workItem.isInitializeCase = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showComplete).toEqual(false);
      expect(result.showSendTo).toEqual(false);
    });

    it('should return showUnassignedIcon as true when assigneeName is falsy and highPriority is false', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        assigneeName: '',
        highPriority: false,
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toEqual(true);

      workItem.highPriority = true;

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toBeFalsy();

      workItem.highPriority = false;
      workItem.assigneeName = 'Not Unassigned';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.showUnassignedIcon).toBeFalsy();
    });

    it('should show status icons based on caseStatus for a petitions clerk', () => {
      const applicationContextPetitionsClerk = {
        ...applicationContext,
        getCurrentUser: () => petitionsClerkUser,
      };

      const workItem = {
        ...FORMATTED_WORK_ITEM,
        caseStatus: Case.STATUS_TYPES.batchedForIRS,
      };

      let result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showBatchedStatusIcon).toEqual(true);
      expect(result.showUnreadStatusIcon).toEqual(false);
      expect(result.showUnassignedIcon).toEqual(false);

      workItem.caseStatus = Case.STATUS_TYPES.recalled;

      result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showRecalledStatusIcon).toEqual(true);
      expect(result.showUnreadStatusIcon).toEqual(false);

      workItem.caseStatus = Case.STATUS_TYPES.generalDocket;

      result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showBatchedStatusIcon).toEqual(false);
      expect(result.showRecalledStatusIcon).toEqual(false);

      workItem.caseStatus = Case.STATUS_TYPES.new;

      result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showBatchedStatusIcon).toEqual(false);
      expect(result.showRecalledStatusIcon).toEqual(false);

      workItem.caseStatus = 'Something Else (so use the default)';

      result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showBatchedStatusIcon).toEqual(false);
      expect(result.showRecalledStatusIcon).toEqual(false);
    });

    it('should NOT show recalled status or batched status icons if the user is not a petitions clerk', () => {
      const applicationContextPetitionsClerk = {
        ...applicationContext,
        getCurrentUser: () => docketClerkUser,
      };

      const workItem = {
        ...FORMATTED_WORK_ITEM,
        caseStatus: Case.STATUS_TYPES.batchedForIRS,
      };

      let result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showBatchedStatusIcon).toEqual(false);

      workItem.caseStatus = Case.STATUS_TYPES.recalled;

      result = formatWorkItem({
        applicationContext: applicationContextPetitionsClerk,
        workItem,
      });
      expect(result.showRecalledStatusIcon).toEqual(false);
    });

    it('should return docketNumberWithSuffix as a combination of the docketNumber and docketNumberSuffix', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        docketNumber: '123-45',
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.docketNumberWithSuffix).toEqual('123-45');

      workItem.docketNumberSuffix = 'S';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.docketNumberWithSuffix).toEqual('123-45S');
    });

    it('should return selected as true workItemId is found in selectedWorkItems', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        workItemId: '123',
      };

      const selectedWorkItems = [
        {
          workItemId: '234',
        },
        {
          workItemId: '345',
        },
      ];

      let result = formatWorkItem({
        applicationContext,
        selectedWorkItems,
        workItem,
      });
      expect(result.selected).toEqual(false);

      workItem.workItemId = '234';

      result = formatWorkItem({
        applicationContext,
        selectedWorkItems,
        workItem,
      });
      expect(result.selected).toEqual(true);
    });

    it('should set the first of messages array as currentMessage', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.currentMessage.messageId).toEqual(
        FORMATTED_WORK_ITEM.messages[0].messageId,
      );
    });

    it('should return currentMessage.createdAt for receivedAt when workQueueIsInternal is true', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
      };

      workItem.messages[0].createdAt = '2018-12-25T18:05:54.166Z';
      workItem.messages[1].createdAt = '2018-12-26T18:05:54.166Z';

      const result = formatWorkItem({
        applicationContext,
        workItem,
        workQueueIsInternal: true,
      });

      expect(result.receivedAt).toEqual('2018-12-26T18:05:54.166Z');
    });

    it('should return document.createdAt for receivedAt when workQueueIsInternal is false', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          createdAt: '2018-12-26T18:05:54.166Z',
          receivedAt: '2018-12-27T18:05:54.166Z',
        },
      };

      workItem.messages[0].createdAt = '2018-12-24T18:05:54.166Z';
      workItem.messages[1].createdAt = '2018-12-25T18:05:54.166Z';

      const result = formatWorkItem({
        applicationContext,
        workItem,
        workQueueIsInternal: false,
      });
      expect(result.receivedAt).toEqual(result.document.receivedAt);
    });

    it('should return document.createdAt for receivedAt when document.receivedAt is today and workQueueIsInternal is false', () => {
      const now = new Date().toISOString();
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          createdAt: '2018-12-27T18:05:54.166Z',
          receivedAt: now,
        },
      };

      workItem.messages[0].createdAt = '2018-12-24T18:05:54.166Z';
      workItem.messages[1].createdAt = '2018-12-25T18:05:54.166Z';

      const result = formatWorkItem({
        applicationContext,
        workItem,
        workQueueIsInternal: false,
      });
      expect(result.receivedAt).toEqual(result.document.createdAt);
    });

    it('should return received as receivedAt when receivedAt is NOT today', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          createdAt: '2018-12-27T18:05:54.166Z',
          receivedAt: '2018-12-27T18:05:54.166Z',
        },
      };

      workItem.messages[0].createdAt = '2018-12-24T18:05:54.166Z';
      workItem.messages[1].createdAt = '2018-12-25T18:05:54.166Z';

      const result = formatWorkItem({
        applicationContext,
        workItem,
        workQueueIsInternal: false,
      });
      expect(result.received).toEqual('12/27/18');
    });

    it('should set historyMessages as all messages except the latest message', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        historyMessages: [],
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.historyMessages[0].messageId).toEqual(
        result.messages[1].messageId,
      );
    });

    it('should set batchedAt when the messages contain a Petition batched for IRS', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        messages: [
          ...FORMATTED_WORK_ITEM.messages,
          {
            createdAt: '2018-12-24T18:05:54.166Z',
            message: 'Petition batched for IRS',
          },
        ],
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.batchedAt).toEqual('12/24/18 1:05 pm ET');
    });

    it('should return isCourtIssuedDocument as true when the documentType is a court issued document type', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          documentType: 'Petition',
        },
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.isCourtIssuedDocument).toEqual(false);

      workItem.document.documentType = 'TRAN - Transcript';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.isCourtIssuedDocument).toEqual(true);
    });

    it('should return isOrder as true when the documentType is a court issued document type', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          documentType: 'Petition',
        },
      };

      let result = formatWorkItem({ applicationContext, workItem });
      expect(result.isOrder).toEqual(false);

      workItem.document.documentType = 'Order';

      result = formatWorkItem({ applicationContext, workItem });
      expect(result.isOrder).toEqual(true);
    });

    it('should return the documentType as descriptionDisplay if no documentTitle is present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          documentType: 'Document Type',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.document.descriptionDisplay).toEqual('Document Type');
    });

    it('should return the documentTitle as descriptionDisplay if no additionalInfo is present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          documentTitle: 'Document Title',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.document.descriptionDisplay).toEqual('Document Title');
    });

    it('should return the documentTitle with additionalInfo as descriptionDisplay if documentTitle and additionalInfo are present', () => {
      const workItem = {
        ...FORMATTED_WORK_ITEM,
        document: {
          ...FORMATTED_WORK_ITEM.document,
          additionalInfo: 'with Additional Info',
          documentTitle: 'Document Title',
        },
      };

      const result = formatWorkItem({ applicationContext, workItem });
      expect(result.document.descriptionDisplay).toEqual(
        'Document Title with Additional Info',
      );
    });
  });
});
