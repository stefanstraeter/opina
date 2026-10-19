import { Component, output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Button } from '@shared/components/button/button';
import { clearControl } from '@shared/forms/clear-control';
import { notBeforeDate } from '@shared/validators/date';
import { todayAsIsoDate } from '@shared/utils/date';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { PlusIcon } from '@shared/components/plus-icon/plus-icon';
import { SURVEY_CATEGORIES } from '@survey/model/constants/survey-categories';
import { Survey } from '@survey/model/interfaces/survey';
import { Answer, Question } from '@survey/model/interfaces/question';
import { CreateQuestion } from './create-question/create-question';
import {
  createQuestionGroup,
  QuestionFormGroup,
} from './model/question-answers-form';

/**
 * @description Shows the form for creating a survey: title, end date, description, category and questions.
 * Checks the input and passes a finished survey to the parent page.
 * @export
 * @class SurveyForm
 */
@Component({
  imports: [
    Button,
    Dropdown,
    PlusIcon,
    CreateQuestion,
    ReactiveFormsModule,
  ],
  selector: 'app-survey-form',
  styleUrl: './survey-form.scss',
  templateUrl: './survey-form.html',
})
export class SurveyForm {
  submitted = output<Survey>();
  today = todayAsIsoDate();

  surveyForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    deadline: new FormControl('', {
      nonNullable: true,
      validators: [notBeforeDate(this.today)],
    }),
    description: new FormControl('', { nonNullable: true }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    questions: new FormArray([createQuestionGroup()]),
  });

  categoryOptions: DropdownOption[] = SURVEY_CATEGORIES;

  /**
   * @description Adds a new, empty question to the form.
   * @memberof SurveyForm
   */
  addQuestion(): void {
    this.surveyForm.controls.questions.push(createQuestionGroup());
  }

  /**
   * @description Removes the question at this position. The first question cannot be removed, its text is only cleared.
   * @param {number} questionIndex - The index of the question to remove.
   * @memberof SurveyForm
   */
  removeQuestion(questionIndex: number): void {
    if (questionIndex === 0) {
      this.clearFirstQuestion();
    } else {
      this.surveyForm.controls.questions.removeAt(questionIndex);
    }
  }

  /**
   * @description Empties the text of the first question. The first question must always stay.
   * @private
   * @memberof SurveyForm
   */
  private clearFirstQuestion(): void {
    clearControl(this.surveyForm.controls.questions.at(0).controls.text);
  }

  /**
   * @description Runs when the user clicks Publish. If the form is invalid, all errors become visible and nothing is sent.
   * If it is valid, the finished survey is passed to the parent page.
   * @return {void}
   * @memberof SurveyForm
   */
  handleSubmit(): void {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.buildSurvey());
  }

  /**
   * @description Turns the form values into a Survey object. The id 0 is a placeholder, the database sets the real id.
   * @private
   * @return {Survey} - The finished survey object.
   * @memberof SurveyForm
   */
  private buildSurvey(): Survey {
    return {
      id: 0, // id ist ein Platzhalter, die "echte" ID wird von der Datenbank generiert
      title: this.surveyForm.controls.title.value,
      category: this.surveyForm.controls.category.value,
      deadline: this.surveyForm.controls.deadline.value,
      description: this.surveyForm.controls.description.value,
      questions: this.surveyForm.controls.questions.controls.map(
        (questionGroup) => this.buildQuestion(questionGroup),
      ),
    };
  }

  /**
   * @description Turns one question from the form into a Question object, including its answers.
   * @private
   * @param {QuestionFormGroup} questionGroup - The form group for the question.
   * @return {Question}
   * @memberof SurveyForm
   */
  private buildQuestion(questionGroup: QuestionFormGroup): Question {
    return {
      id: 0,
      text: questionGroup.controls.text.value,
      multiple: questionGroup.controls.multiple.value,
      answers: questionGroup.controls.answers.controls.map((answerControl) =>
        this.buildAnswer(answerControl),
      ),
    };
  }

  /**
   * @description Turns an answer form control into an Answer object.
   * @private
   * @param {FormControl<string>} answerControl - The form control for the answer text.
   * @return {Answer} - The finished answer object.
   * @memberof SurveyForm
   */
  private buildAnswer(answerControl: FormControl<string>): Answer {
    return {
      id: 0,
      votes: 0,
      text: answerControl.value,
    };
  }
}
