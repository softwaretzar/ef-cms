import { state } from 'cerebral';

/**
 * sets the state[props.form].assigneeId to the props.users passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const resetFormAssigneeIdAction = ({ props, store }) => {
  store.set(state[props.form].assigneeId, '');
};
