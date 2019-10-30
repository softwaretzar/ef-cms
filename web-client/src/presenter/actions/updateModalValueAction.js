import { state } from 'cerebral';

/**
 * sets the modal[props.key] to the props.value in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const updateModalValueAction = ({ props, store }) => {
  store.set(state.modal[props.key], props.value);
};
