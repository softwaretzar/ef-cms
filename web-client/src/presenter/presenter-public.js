import { createConnect } from 'overmind-react';
import { state } from './state-public';

import { cerebralBindSimpleSetStateSequence } from './sequences/cerebralBindSimpleSetStateSequence';
import { clearAdvancedSearchFormSequence } from './sequences/clearAdvancedSearchFormSequence';
import { clearDocketNumberSearchFormSequence } from './sequences/clearDocketNumberSearchFormSequence';
import { clearPdfPreviewUrlSequence } from './sequences/clearPdfPreviewUrlSequence';
import { gotoPublicCaseDetailSequence } from './sequences/public/gotoPublicCaseDetailSequence';
import { gotoPublicPrintableDocketRecordSequence } from './sequences/public/gotoPublicPrintableDocketRecordSequence';
import { gotoPublicSearchSequence } from './sequences/public/gotoPublicSearchSequence';
import { navigateBackSequence } from './sequences/navigateBackSequence';
import { navigateToCognitoSequence } from './sequences/navigateToCognitoSequence';
import { navigateToPublicSiteSequence } from './sequences/public/navigateToPublicSiteSequence';
import { showMoreResultsSequence } from './sequences/showMoreResultsSequence';
import { submitCaseDocketNumberSearchSequence } from './sequences/submitCaseDocketNumberSearchSequence';
import { submitPublicAdvancedSearchSequence } from './sequences/public/submitPublicAdvancedSearchSequence';
import { toggleBetaBarSequence } from './sequences/toggleBetaBarSequence';
import { toggleUsaBannerDetailsSequence } from './sequences/toggleUsaBannerDetailsSequence';
import { updateAdvancedSearchFormValueSequence } from './sequences/updateAdvancedSearchFormValueSequence';
import { updateDocketNumberSearchFormSequence } from './sequences/updateDocketNumberSearchFormSequence';

// eslint-disable-next-line spellcheck/spell-checker
// https://overmindjs.org/guides/beginner/08_usingovermindwithreact?view=react&typescript=false

export const connect = createConnect();
export const presenter = {
  actions: {},
  providers: {},
  sequences: {
    cerebralBindSimpleSetStateSequence,
    clearAdvancedSearchFormSequence,
    clearDocketNumberSearchFormSequence,
    clearPdfPreviewUrlSequence,
    gotoPublicCaseDetailSequence,
    gotoPublicPrintableDocketRecordSequence,
    gotoPublicSearchSequence,
    navigateBackSequence,
    navigateToCognitoSequence,
    navigateToPublicSiteSequence,
    showMoreResultsSequence,
    submitCaseDocketNumberSearchSequence,
    submitPublicAdvancedSearchSequence,
    toggleBetaBarSequence,
    toggleUsaBannerDetailsSequence,
    updateAdvancedSearchFormValueSequence,
    updateDocketNumberSearchFormSequence,
  },
  state,
};
