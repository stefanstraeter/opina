import { buildVoteKey } from '@survey/rules/voted-key';

const VOTED_FLAG_VALUE = 'true';

/**
 * @description Remembers in this browser that the user has voted on a survey.
 * @export
 * @param {number} surveyId - The id of the survey that was voted on.
 * @return {void}
 */
export function markSurveyAsVoted(surveyId: number): void {
  localStorage.setItem(buildVoteKey(surveyId), VOTED_FLAG_VALUE);
}

/**
 * @description Checks whether the user has already voted on a survey in this browser.
 * @export
 * @param {number} surveyId - The id of the survey to check.
 * @return {boolean} - true if the survey was already voted on, otherwise false.
 */
export function hasVotedForSurvey(surveyId: number): boolean {
  return localStorage.getItem(buildVoteKey(surveyId)) === VOTED_FLAG_VALUE;
}
