import { generateCaseConfirmationPdfUrlAction } from '../actions/CaseConfirmation/generateCaseConfirmationPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintableCaseConfirmationSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  setBaseUrlAction,
  generateCaseConfirmationPdfUrlAction,
  setCurrentPageAction('PrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
