import { Survey } from '@survey/model/interfaces/survey';

const NO_END_DATE_TEXT = 'no end date';

/**
 * @description Builds the short info line of a survey, for example
 * "4 questions · ends 01.09.2025".
 * @export
 * @param {Survey} survey - The survey to describe.
 * @return {string} - The number of questions and the end date.
 */
export function buildPublishedInfo(survey: Survey): string {
  const questionCount = survey.questions.length;
  const questionText = questionCount === 1 ? 'question' : 'questions';
  return `${questionCount} ${questionText} · ${buildEndText(survey.deadline)}`;
}

/**
 * @description Turns the end date from YYYY-MM-DD into "ends DD.MM.YYYY".
 * A survey without an end date gets "no end date".
 * @param {string} deadline - The end date as text, or an empty text.
 * @return {string} - The end date as text for the user.
 */
function buildEndText(deadline: string): string {
  if (!deadline) {
    return NO_END_DATE_TEXT;
  }
  const [year, month, day] = deadline.split('-');
  return `ends ${day}.${month}.${year}`;
}
