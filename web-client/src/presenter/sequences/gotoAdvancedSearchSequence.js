import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { resetAdvancedSearchPageAction } from '../actions/resetAdvancedSearchPageAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultCountryTypeOnAdvancedSearchFormAction } from '../actions/AdvancedSearch/setDefaultCountryTypeOnAdvancedSearchFormAction';

export const gotoAdvancedSearchSequence = [
  clearScreenMetadataAction,
  closeMobileMenuAction,
  resetAdvancedSearchPageAction,
  setDefaultCountryTypeOnAdvancedSearchFormAction,
  setAdvancedSearchPropsOnFormAction,
  setCurrentPageAction('AdvancedSearch'),
];
