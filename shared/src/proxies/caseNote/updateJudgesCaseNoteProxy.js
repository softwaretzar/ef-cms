const { put } = require('../requests');

/**
 * updateJudgesCaseNoteInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.notes the notes to add to the case for the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateJudgesCaseNoteInteractor = ({
  applicationContext,
  caseId,
  notes,
}) => {
  return put({
    applicationContext,
    body: { notes },
    endpoint: `/case-notes/judges/${caseId}`,
  });
};
