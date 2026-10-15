import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { Checkbox } from '@shared/components/checkbox/checkbox';
import { DeleteIcon } from '@shared/components/delete-icon/delete-icon';
import { PlusIcon } from '@shared/components/plus-icon/plus-icon';
import { clearControl } from '@shared/forms/clear-control';
import {
  createAnswerControl,
  QuestionFormGroup,
} from '../model/question-answers-form';
import { CreateAnswer } from './create-answer/create-answer';

const MAX_ANSWERS = 8;
const MIN_ANSWERS = 2;

/**
 * @description Shows one question with its answers. The question group is
 * received from the parent form, this class only handles adding, clearing
 * and removing answers. The first two answers are required, the rest are optional.
 * @export
 * @class CreateQuestion
 */
@Component({
  imports: [
    ReactiveFormsModule,
    Button,
    Checkbox,
    DeleteIcon,
    PlusIcon,
    CreateAnswer,
  ],
  selector: 'app-create-question',
  styleUrl: './create-question.scss',
  templateUrl: './create-question.html',
})
export class CreateQuestion {
  questionGroup = input.required<QuestionFormGroup>();
  questionIndex = input.required<number>();
  remove = output<void>();

  /**
   * @description Adds a new answer, but only if the limit has not been reached.
   * @memberof CreateQuestion
   */
  addAnswer(): void {
    if (this.canAddAnswer()) {
      this.questionGroup().controls.answers.push(createAnswerControl());
    }
  }

  /**
   * @description Checks if another answer may be added.
   * @return {boolean}  
   * @memberof CreateQuestion
   */
  canAddAnswer(): boolean {
    return !this.hasReachedAnswerLimit();
  }

  /**
   * @description Called by the template. Clears the first answers (they must stay),
   * and removes all others.
  
   * @param {number} answerIndex
   * @memberof CreateQuestion
   */
  removeAnswer(answerIndex: number): void {
    if (this.canRemoveAnswer(answerIndex)) {
      this.deleteAnswer(answerIndex);
    } else {
      clearControl(this.questionGroup().controls.answers.at(answerIndex));
    }
  }

  /**
   * @description Checks the position only. Answers below MIN_ANSWERS must stay.
   * @param {number} answerIndex
   * @return {boolean}  
   * @memberof CreateQuestion
   */
  canRemoveAnswer(answerIndex: number): boolean {
    return answerIndex >= MIN_ANSWERS;
  }

  /**
   * @description Removes the answer at this position. Does not check anything itself.
   * @param {number} answerIndex
   * @memberof CreateQuestion
   */
  deleteAnswer(answerIndex: number): void {
    this.questionGroup().controls.answers.removeAt(answerIndex);
  }

  /**
   * @description Checks if the maximum number of answers has been reached.
   * @return {boolean}  
   * @memberof CreateQuestion
   */
  hasReachedAnswerLimit(): boolean {
    return this.questionGroup().controls.answers.length >= MAX_ANSWERS;
  }
}
