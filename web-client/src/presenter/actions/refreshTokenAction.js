import { state } from 'cerebral';
import qs from 'qs';

/**
 * Takes the selected work items in the store and invoke the assignWorkItems so that the assignee is attached to each
 * of the work items.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext contains the assignWorkItems method we will need from the getUseCases method
 * @param {Object} providers.store the cerebral store containing the selectedWorkItems, workQueue, assigneeId, assigneeName this method uses
 * @param {Function} providers.get the cerebral get helper function
 * @returns {undefined} currently doesn't return anything
 */
export const refreshTokenAction = async ({
  applicationContext,
  get,
  store,
  props,
}) => {
  const refreshToken = get(state.refreshToken);

  const data = qs.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: '6tu6j1stv5ugcut7dqsqdurn8q', // TODO: replace with redirect client_id
  });

  const response = await applicationContext
    .getHttpClient()
    .post(`${applicationContext.getCognitoTokenUrl()}`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then(response => response.data);

  console.log('response', response);

  return {
    token: response.id_token,
  };
};
