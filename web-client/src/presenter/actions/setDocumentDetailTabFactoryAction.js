import { state } from 'cerebral';

export const setDocumentDetailTabFactoryAction = tab =>
  /**
   * sets the state.documentDetail.tab
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store
   * @param {object} providers.props the cerebral props object
   */
  ({ store }) => {
    store.set(state.documentDetail.tab, tab);
  };
