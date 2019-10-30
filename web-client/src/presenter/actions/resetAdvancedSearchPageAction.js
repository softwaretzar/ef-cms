import { state } from 'cerebral';

/**
 * sets the state.advancedSearchForm.currentPage to 1
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const resetAdvancedSearchPageAction = ({ store }) => {
  store.set(state.advancedSearchForm.currentPage, 1);
};
