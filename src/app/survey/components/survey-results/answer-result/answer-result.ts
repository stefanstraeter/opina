import { Component, input } from '@angular/core';
import { ProgressBar } from '@shared/components/progress-bar/progress-bar';

@Component({
  imports: [ProgressBar],
  selector: 'app-answer-result',
  styleUrl: './answer-result.scss',
  templateUrl: './answer-result.html',
})
export class AnswerResult {
  answerIndex = input.required<number>();
  percentage = input.required<number>();

  /**
   * @description Turns the position into a letter (0 -> A, 1 -> B, ...), same trick as CreateAnswer/AnswerOption.
   * @return {string}
   * @memberof AnswerResult
   */
  answerLetter(): string {
    return String.fromCharCode(65 + this.answerIndex()); // 65 = 'A' im Zeichencode
  }
}
