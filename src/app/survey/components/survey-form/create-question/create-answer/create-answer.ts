import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { DeleteIcon } from '@shared/components/delete-icon/delete-icon';
/**
 * @description This component represents a single answer input field in the survey form.
 * It includes a text input for the answer and a delete button to remove the answer.
 * @export
 * @class CreateAnswer
 */
@Component({
  imports: [ReactiveFormsModule, Button, DeleteIcon],
  selector: 'app-create-answer',
  styleUrl: './create-answer.scss',
  templateUrl: './create-answer.html',
})
export class CreateAnswer {
  answerControl = input.required<FormControl<string>>();
  answerIndex = input.required<number>();
  remove = output<void>();

  /**
   * @description Returns the letter corresponding to the answer index (e.g., 0 -> A, 1 -> B, etc.).
   * @return {string} - The letter corresponding to the answer index.
   * @memberof CreateAnswer
   */
  answerLetter(): string {
    return String.fromCharCode(65 + this.answerIndex());
  }
}
