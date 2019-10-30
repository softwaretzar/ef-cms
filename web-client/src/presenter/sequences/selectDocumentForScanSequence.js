import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { set } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from '../sequences/setPdfPreviewUrlSequence';
import { shouldShowPreviewAction } from '../actions/shouldShowPreviewAction';
import { state } from 'cerebral';
import { unsetDocumentSelectedForPreviewAction } from '../actions/unsetDocumentSelectedForPreviewAction';

export const selectDocumentForScanSequence = [
  unsetDocumentSelectedForPreviewAction,
  set(state.documentUploadMode, 'scan'),
  shouldShowPreviewAction,
  {
    no: [],
    yes: [
      selectDocumentForPreviewAction,
      ...setPdfPreviewUrlSequence,
      set(state.documentUploadMode, 'preview'),
    ],
  },
];
