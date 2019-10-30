import { state } from 'cerebral';

/**
 * unset state.documentSelectedForPreview
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const unsetDocumentSelectedForPreviewAction = ({ store }) => {
  store.unset(state.documentSelectedForPreview);
};
