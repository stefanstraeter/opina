const VOTED_KEY_PREFIX = 'survey_voted_';

/**
 * @description Builds the localStorage key that marks one survey as already
 * voted in this browser. Every survey gets its own key.
 * @export
 * @param {number} surveyId - The id of the survey.
 * @return {string} - The storage key, e.g. 'survey_voted_42'.
 */
export function buildVoteKey(surveyId: number): string {
  return `${VOTED_KEY_PREFIX}${surveyId}`;
}
