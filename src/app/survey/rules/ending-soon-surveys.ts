import { Survey } from '@survey/model/interfaces/survey';

/**
 * @description Picks the three surveys that end first. Surveys without an end date
 * or with an end date before today are left out.
 * @export
 * @param {Survey[]} surveys - All surveys to choose from.
 * @param {string} today - Today's date in the format YYYY-MM-DD.
 * @return {Survey[]} - Up to three surveys, the one that ends first comes first.
 */
export function getEndingSoonSurveys(surveys: Survey[], today: string): Survey[] {
  return surveys
    .filter((survey) => !!survey.deadline && survey.deadline >= today)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);
}
