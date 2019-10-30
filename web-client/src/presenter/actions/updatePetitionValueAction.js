import { state } from 'cerebral';

/**
 * set state.petition[props.key]
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 */
export const updatePetitionValueAction = ({ props, store }) => {
  store.set(state.petition[props.key], props.value);
};
