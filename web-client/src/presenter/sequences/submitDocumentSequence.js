import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { fileRespondentDocument } from '../actions/fileRespondentDocumentAction';
import { getCase } from '../actions/getCaseAction';
import { getDocumentType } from '../actions/getDocumentTypeAction';
import { setAlertSuccess } from '../actions/setAlertSuccessAction';
import { setCase } from '../actions/setCaseAction';
import { setFormSubmitting } from '../actions/setFormSubmittingAction';
import { unsetFormSubmitting } from '../actions/unsetFormSubmittingAction';

export const submitDocumentSequence = [
  clearAlertsAction,
  setFormSubmitting,
  getDocumentType,
  {
    answer: [fileRespondentDocument],
    stipulatedDecision: [fileRespondentDocument],
  },
  getCase,
  setCase,
  setAlertSuccess,
  unsetFormSubmitting,
  set(state.currentTab, 'Docket Record'),
];
