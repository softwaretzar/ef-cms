const createApplicationContext = require('../applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('../middleware/apiGatewayHelper');

/**
 * batch download trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const { trialSessionId } = event.pathParameters || event.path;
      const results = await applicationContext
        .getUseCases()
        .batchDownloadTrialSessionInteractor({
          applicationContext,
          trialSessionId,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
