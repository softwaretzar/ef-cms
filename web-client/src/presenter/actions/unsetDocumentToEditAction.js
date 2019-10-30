import { state } from 'cerebral';

/**
 * unset state.documentToEdit
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const unsetDocumentToEditAction = ({ store }) => {
  store.unset(state.documentToEdit);
};
