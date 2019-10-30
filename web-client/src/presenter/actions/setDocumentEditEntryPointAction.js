import { state } from 'cerebral';

/**
 * sets state.editDocumentEntryPoint
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDocumentEditEntryPointAction = ({ store }) => {
  store.set(state.editDocumentEntryPoint, 'CaseDetail');
};
