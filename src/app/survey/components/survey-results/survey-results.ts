import { Component, input } from '@angular/core';
import { Survey } from '@survey/model/interfaces/survey';
import { Question, Answer } from '@survey/model/interfaces/question';
import { formatPositionNumber } from '@shared/utils/position-number';
import { isHighestValue } from '@survey/rules/highest-value';
import { AnswerResult } from './answer-result/answer-result';

const PREVIEW_VOTE_COUNT = 1;

/**
 * @description Shows the live results of a survey: per question, one bar per
 * answer with its percentage. The bar of the answer with the most votes is
 * highlighted. Shows a placeholder instead, as long as no answer has any
 * votes yet. The results are always visible.
 * @export
 * @class SurveyResults
 */
@Component({
  imports: [AnswerResult],
  selector: 'app-survey-results',
  styleUrl: './survey-results.scss',
  templateUrl: './survey-results.html',
})
export class SurveyResults {
  survey = input.required<Survey>();
  previewAnswerIds = input<number[]>([]);

  /**
   * @description Checks whether any answer in the whole survey has at least one vote.
   * @return {boolean}
   * @memberof SurveyResults
   */
  hasVotes(): boolean {
    return this.survey().questions.some((question) =>
      question.answers.some((answer) => this.votesWithPreview(answer) > 0),
    );
  }

  /**
   * @description Turns the position of a question into the text in front of it
   * ("01", "02", ...).
   * @param {number} questionIndex - The position of the question, starting at 0.
   * @return {string}
   * @memberof SurveyResults
   */
  questionNumber(questionIndex: number): string {
    return formatPositionNumber(questionIndex + 1);
  }

  /**
   * @description Checks if this answer has the most votes of its question, so
   * its bar is shown in the strong color.
   * @param {Question} question
   * @param {Answer} answer
   * @return {boolean}
   * @memberof SurveyResults
   */
  isHighest(question: Question, answer: Answer): boolean {
    const allVotes = question.answers.map((item) => this.votesWithPreview(item));
    return isHighestValue(this.votesWithPreview(answer), allVotes);
  }

  /**
   * @description Calculates what share of this question's votes went to one answer, in percent.
   * @param {Question} question
   * @param {Answer} answer
   * @return {number}
   * @memberof SurveyResults
   */
  percentage(question: Question, answer: Answer): number {
    const total = this.totalVotes(question);
    return total === 0
      ? 0
      : Math.round((this.votesWithPreview(answer) / total) * 100);
  }

  /**
   * @description Sums up the votes of all answers of one question.
   * @private
   * @param {Question} question
   * @return {number}
   * @memberof SurveyResults
   */
  private totalVotes(question: Question): number {
    return question.answers.reduce(
      (sum, answer) => sum + this.votesWithPreview(answer),
      0,
    );
  }

  /**
   * @description Returns the votes of one answer including the preview: if
   * the user currently has this answer selected, one vote is added.
   * @private
   * @param {Answer} answer
   * @return {number}
   * @memberof SurveyResults
   */
  private votesWithPreview(answer: Answer): number {
    const isSelected = this.previewAnswerIds().includes(answer.id);
    return isSelected ? answer.votes + PREVIEW_VOTE_COUNT : answer.votes;
  }
}
