import { Component, input, output } from '@angular/core';
import { Checkbox } from '@shared/components/checkbox/checkbox';

@Component({
  imports: [Checkbox],
  selector: 'app-answer-option',
  styleUrl: './answer-option.scss',
  templateUrl: './answer-option.html',
})
export class AnswerOption {
  answerIndex = input.required<number>();
  text = input.required<string>();
  selected = input<boolean>(false);
  locked = input<boolean>(false);
  toggled = output<void>();

  /**
   * @description Turns the position into a letter (0 -> A, 1 -> B, ...),
   * same trick as CreateAnswer.
   * @return {string}
   * @memberof AnswerOption
   */
  answerLetter(): string {
    return String.fromCharCode(65 + this.answerIndex());
  }
}
