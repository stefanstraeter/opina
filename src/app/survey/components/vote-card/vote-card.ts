import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Button } from '@shared/components/button/button';
import { StatusBadge } from '@shared/components/status-badge/status-badge';
import { CloseIcon } from '@shared/components/close-icon/close-icon';
import { Survey } from '@survey/model/interfaces/survey';
import { VoteQuestion } from './vote-question/vote-question';
import { Surveys } from '@survey/services/surveys';
import { Notifications } from '@core/services/notifications';
import {
  markSurveyAsVoted,
  hasVotedForSurvey,
} from '@survey/services/vote-storage';
import { hasEnded } from '@survey/rules/survey-filter';
import { todayAsIsoDate } from '@shared/utils/date';
import {
  ERROR_NOTIFICATION_DURATION_MS,
  REDIRECT_DELAY_MS,
} from '@survey/model/constants/feedback-timing';

/**
 * @description Shows one survey as a card: status, meta info, title,
 * description and its questions. Lets the user leave the survey via the
 * close button and submit the vote via the complete button. The survey is
 * locked if this browser already voted or if the survey has ended.
 * @export
 * @class VoteCard
 */
@Component({
  imports: [DatePipe, RouterLink, Button, StatusBadge, CloseIcon, VoteQuestion],
  selector: 'app-vote-card',
  styleUrl: './vote-card.scss',
  templateUrl: './vote-card.html',
})
export class VoteCard {
  private surveys = inject(Surveys);
  private router = inject(Router);
  private notifications = inject(Notifications);

  survey = input.required<Survey>();
  previewChange = output<number[]>();

  private selectedAnswersByQuestion = signal<Record<number, number[]>>({});
  private hasCompleted = signal(false);
  allQuestionsAnswered = computed(() =>
    this.survey().questions.every((question) => this.hasSelection(question.id)),
  );

  // true, if this browser already voted on the survey (read from localStorage)
  hasVotedBefore = computed(() => hasVotedForSurvey(this.survey().id));

  // true, if the end date of the survey is before today
  isEnded = computed(() => hasEnded(this.survey(), todayAsIsoDate()));

  // true, if the survey is read-only: voted earlier or just now, or ended
  locked = computed(
    () => this.hasCompleted() || this.hasVotedBefore() || this.isEnded(),
  );
  canComplete = computed(() => this.allQuestionsAnswered() && !this.locked());

  /**
   * @description Remembers the selected answers of one question. The other
   * questions keep their selection. Reports all selected answers upwards,
   * so the results can show a preview.
   * @param {number} questionId
   * @param {number[]} answerIds
   * @return {void}
   * @memberof VoteCard
   */

  updateSelection(questionId: number, answerIds: number[]): void {
    this.selectedAnswersByQuestion.update((selected) => ({
      ...selected,
      [questionId]: answerIds,
    }));
    this.previewChange.emit(this.getSelectedAnswerIds());
  }

  /**
   * @description Sends all selected answers as votes to the database.
   * Does nothing as long as not every question has an answer, or after the
   * votes were already sent. Tells the user whether it worked.
   * @return {Promise<void>} - Resolves when the votes are saved or the error is handled.
   * @memberof VoteCard
   */
  async completeSurvey(): Promise<void> {
    const isBlocked = !this.canComplete();
    if (isBlocked) {
      return;
    }
    try {
      await this.surveys.submitVotes(this.getSelectedAnswerIds());
      this.handleVoteSuccess();
    } catch (error) {
      this.handleVoteError(error);
    }
  }

  /**
   * @description Blocks the complete button, remembers in this browser that
   * the survey was voted on, shows a thank-you notification and navigates
   * back to the home page after a short delay.
   * @private
   * @return {void}
   * @memberof VoteCard
   */
  private handleVoteSuccess(): void {
    this.hasCompleted.set(true);
    markSurveyAsVoted(this.survey().id);
    this.notifications.show('Thank you for voting!');
    setTimeout(() => this.router.navigate(['/']), REDIRECT_DELAY_MS);
  }

  /**
   * @description Logs the error and shows an error notification, so the user
   * knows the vote was not saved and can try again.
   * @private
   * @param {unknown} error - The error thrown while saving the votes.
   * @return {void}
   * @memberof VoteCard
   */
  private handleVoteError(error: unknown): void {
    console.error('Could not submit votes:', error);
    this.notifications.show(
      'Could not save your vote. Please try again.',
      ERROR_NOTIFICATION_DURATION_MS,
    );
  }

  /**
   * @description Checks whether at least one answer is selected for a question.
   * Questions that were never clicked have no entry yet, so they count as empty.
   * @private
   * @param {number} questionId
   * @return {boolean}
   * @memberof VoteCard
   */
  private hasSelection(questionId: number): boolean {
    const answerIds = this.selectedAnswersByQuestion()[questionId] ?? [];
    return answerIds.length > 0;
  }

  /**
   * @description Puts the selected answers of all questions into one flat
   * list, because the database only needs the answer ids.
   * @private
   * @return {number[]} - The ids of all selected answers, e.g. [34, 40, 41].
   * @memberof VoteCard
   */
  private getSelectedAnswerIds(): number[] {
    return Object.values(this.selectedAnswersByQuestion()).flat();
  }
}
