import { Component, computed, input, output, signal } from '@angular/core';
import { formatPositionNumber } from '@shared/utils/position-number';
import { Question } from '@survey/model/interfaces/question';
import { AnswerOption } from './answer-option/answer-option';

/**
 * @description Shows one question with its answers and keeps track of which
 * answers are currently selected. Enforces single-choice (only one answer at
 * a time) or multiple-choice (several answers independently) depending on
 * question.multiple.
 * @export
 * @class VoteQuestion
 */
@Component({
  imports: [AnswerOption],
  selector: 'app-vote-question',
  styleUrl: './vote-question.scss',
  templateUrl: './vote-question.html',
})
export class VoteQuestion {
  question = input.required<Question>();
  questionIndex = input.required<number>();
  numberText = computed(() => formatPositionNumber(this.questionIndex() + 1));
  locked = input<boolean>(false);
  selectionChange = output<number[]>();

  private selectedAnswerIds = signal<number[]>([]);

  /**
   * @description Checks whether this answer is currently selected.
   * @param {number} answerId
   * @return {boolean}
   * @memberof VoteQuestion
   */
  isSelected(answerId: number): boolean {
    return this.selectedAnswerIds().includes(answerId);
  }

  /**
   * @description Called when an answer is clicked. Updates the selection
   * (single or multiple choice) and reports it to the parent.
   * @param {number} answerId
   * @return {void}
   * @memberof VoteQuestion
   */
  handleAnswerClick(answerId: number): void {
    if (this.question().multiple) {
      this.toggleMultiple(answerId);
    } else {
      this.selectSingle(answerId);
    }
    this.emitSelection();
  }

  /**
   * @description Sends the current selection to the parent component.
   * @private
   * @return {void}
   * @memberof VoteQuestion
   */

  private emitSelection(): void {
    this.selectionChange.emit(this.selectedAnswerIds());
  }

  /**
   * @description Adds or removes one answer from the selection, independently of the others.
   * @private
   * @param {number} answerId
   * @return {void}
   * @memberof VoteQuestion
   */
  private toggleMultiple(answerId: number): void {
    this.selectedAnswerIds.update((ids) => {
      if (ids.includes(answerId)) {
        return ids.filter((id) => id !== answerId);
      } else {
        return [...ids, answerId];
      }
    });
  }

  /**
   * @description Replaces the selection with just this one answer, so only one answer can be selected.
   * @private
   * @param {number} answerId
   * @return {void}
   * @memberof VoteQuestion
   */
  private selectSingle(answerId: number): void {
    this.selectedAnswerIds.set([answerId]);
  }
}
