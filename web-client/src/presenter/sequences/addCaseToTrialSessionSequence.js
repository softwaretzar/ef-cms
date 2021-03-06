import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getAddCaseToTrialSessionCalendarAlertWarningAction } from '../actions/TrialSession/getAddCaseToTrialSessionCalendarAlertWarningAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { navigateToPdfPreviewAction } from '../actions/navigateToPdfPreviewAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setAlternateBackLocationAction } from '../actions/setAlternateBackLocationAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setNoticesForCalendaredTrialSessionAction } from '../actions/TrialSession/setNoticesForCalendaredTrialSessionAction';
import { setPdfPreviewUrlSequence } from './setPdfPreviewUrlSequence';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

const showSuccessAlert = [
  clearModalStateAction,
  setAlertSuccessAction,
  getCaseAction,
  setCaseAction,
];

export const addCaseToTrialSessionSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateAddToTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearModalAction,
      addCaseToTrialSessionAction,
      getTrialSessionDetailsAction,
      isTrialSessionCalendaredAction,
      {
        no: showSuccessAlert,
        yes: [
          setNoticesForCalendaredTrialSessionAction,
          {
            electronic: showSuccessAlert,
            paper: [
              clearModalStateAction,
              ...setPdfPreviewUrlSequence,
              setAlternateBackLocationAction,
              getAddCaseToTrialSessionCalendarAlertWarningAction,
              setAlertWarningAction,
              navigateToPdfPreviewAction,
            ],
          },
        ],
      },
    ]),
  },
];
