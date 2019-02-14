/**
 * forwardWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.forwardWorkItem = async ({
  userId,
  workItemId,
  assigneeId,
  message,
  applicationContext,
}) => {
  const response = await applicationContext.getHttpClient().put(
    `${applicationContext.getBaseUrl()}/workitems/${workItemId}?interactorName=forwardWorkItem`,
    {
      assigneeId,
      message,
    },
    {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    },
  );
  return response.data;
};
