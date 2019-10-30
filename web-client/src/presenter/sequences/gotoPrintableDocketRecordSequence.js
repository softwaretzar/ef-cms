import { generateDocketRecordPdfUrlAction } from '../actions/generateDocketRecordPdfUrlAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const gotoPrintableDocketRecordSequence = [
  setWaitingForResponseAction,
  getCaseAction,
  setCaseAction,
  generateDocketRecordPdfUrlAction,
  ...setPdfPreviewUrlSequence,
  setCurrentPageAction('PrintableDocketRecord'),
  unsetWaitingForResponseAction,
];
