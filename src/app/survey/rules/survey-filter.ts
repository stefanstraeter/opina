import { Survey } from '@survey/model/interfaces/survey';

export type SurveyStatusFilter = 'active' | 'ended';

/**
 * @description Checks if a survey is still running. A survey without an end date is always active.
 * A survey whose end date is today or later is active too.
 * @export
 * @param {Survey} survey - The survey to check.
 * @param {string} today - Today's date in the format YYYY-MM-DD.
 * @return {boolean} - True if the survey is still running.
 */
export function isActive(survey: Survey, today: string): boolean {
  return !survey.deadline || survey.deadline >= today;
}

/**
 * @description Checks if a survey has ended. Only a survey with an end date
 * before today has ended. A survey without an end date never ends.
 * @export
 * @param {Survey} survey - The survey to check.
 * @param {string} today - Today's date in the format YYYY-MM-DD.
 * @return {boolean} - True if the survey has ended.
 */
export function hasEnded(survey: Survey, today: string): boolean {
  return !!survey.deadline && survey.deadline < today;
}

/**
 * @description Filters the surveys by status and category.
 * The category 'all' lets every category through.
 * @export
 * @param {Survey[]} surveys - All surveys to choose from.
 * @param {SurveyStatusFilter} status - Show active or ended surveys.
 * @param {string} category - The category to show, or 'all'.
 * @param {string} today - Today's date in the format YYYY-MM-DD.
 * @return {Survey[]} - The surveys that match both filters.
 */
export function filterSurveys(
  surveys: Survey[],
  status: SurveyStatusFilter,
  category: string,
  today: string,
): Survey[] {
  return surveys.filter(
    (survey) =>
      (status === 'active' ? isActive(survey, today) : hasEnded(survey, today)) &&
      (category === 'all' || survey.category === category),
  );
}
