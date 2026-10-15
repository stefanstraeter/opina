import { Component, input, signal } from '@angular/core';
import { Survey } from '@survey/model/interfaces/survey';
import { Question, Answer } from '@survey/model/interfaces/question';
import { DisclosureButton } from '@shared/components/disclosure-button/disclosure-button';
import { AnswerResult } from './answer-result/answer-result';

const PREVIEW_VOTE_COUNT = 1;

/**
 * @description Shows the live results of a survey: per question, one bar per
 * answer with its percentage. Shows a placeholder instead, as long as no
 * answer has any votes yet. The open/closed toggle only matters on mobile,
 * on desktop the results stay visible regardless (handled later via CSS).
 * @export
 * @class SurveyResults
 */
@Component({
  imports: [DisclosureButton, AnswerResult],
  selector: 'app-survey-results',
  styleUrl: './survey-results.scss',
  templateUrl: './survey-results.html',
})
export class SurveyResults {
  survey = input.required<Survey>();
  previewAnswerIds = input<number[]>([]);

  private isOpenSignal = signal(true);
  isOpen = this.isOpenSignal.asReadonly();

  /**
   * @description Flips the open/closed state of the mobile results panel.
   * @return {void}
   * @memberof SurveyResults
   */
  toggleOpen(): void {
    this.isOpenSignal.update((isOpen) => !isOpen);
  }

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
