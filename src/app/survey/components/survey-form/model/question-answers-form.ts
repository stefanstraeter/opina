import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export type QuestionFormGroup = FormGroup<{
  text: FormControl<string>;
  multiple: FormControl<boolean>;
  answers: FormArray<FormControl<string>>;
}>;

/**
 * @description Creates one empty answer field. It is required, so it must be filled in.
 * Used for the two starting answers and for every answer the user adds later.
 * @export
 * @return {FormControl<string>} - A new, empty answer field.
 */
export function createAnswerControl(): FormControl<string> {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
}

/**
 * @description Creates a new question group with an empty text, a single-choice setting (multiple = false)
 * and two empty answer fields. Used for the first question and for every question the user adds.
 * @export
 * @return {QuestionFormGroup} - A new, empty question group.
 */
export function createQuestionGroup(): QuestionFormGroup {
  return new FormGroup({
    text: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    multiple: new FormControl(false, { nonNullable: true }),
    answers: new FormArray([createAnswerControl(), createAnswerControl()]),
  });
}
