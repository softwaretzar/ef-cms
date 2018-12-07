const { getAuthHeader } = require('../middleware/apiGatewayHelper');

const createDocumentMetadataUC = require('ef-cms-shared/src/useCases/createDocumentMetadata');
const { handle } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * Create Document API Lambda
 *
 * @param event
 * @param context
 * @param callback
 */
exports.create = event =>
  handle(() =>
    createDocumentMetadataUC({
      document: {
        ...JSON.parse(event.body),
        userId: getAuthHeader(event),
      },
      applicationContext,
    }),
  );
