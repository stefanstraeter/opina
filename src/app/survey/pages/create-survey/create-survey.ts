import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '@shared/components/status-badge/status-badge';
import { Button } from '@shared/components/button/button';
import { CloseIcon } from '@shared/components/close-icon/close-icon';
import { HeaderActions } from '@core/services/header-actions';
import { Theme } from '@core/services/theme';
import { Notifications } from '@core/services/notifications';
import { Survey } from '@survey/model/interfaces/survey';
import { Surveys } from '@survey/services/surveys';
import { SurveyForm } from '@survey/components/survey-form/survey-form';
import {
  ERROR_NOTIFICATION_DURATION_MS,
  REDIRECT_DELAY_MS,
} from '@survey/model/constants/feedback-timing';

@Component({
  imports: [StatusBadge, Button, CloseIcon, SurveyForm, RouterLink],
  selector: 'app-create-survey',
  styleUrl: './create-survey.scss',
  templateUrl: './create-survey.html',
})
export class CreateSurvey implements OnInit, OnDestroy {
  private theme = inject(Theme);
  private headerActions = inject(HeaderActions);
  private surveysService = inject(Surveys);
  private notifications = inject(Notifications);
  private router = inject(Router);

  /**
   * @description Switches to dark mode and narrows the header when the component is initialized.
   * @return {void}
   * @memberof CreateSurvey
   */
  ngOnInit(): void {
    this.theme.setLightMode(false);
    this.headerActions.setNarrow(true);
  }

  /**
   * @description Resets to light mode and the normal header when the component is destroyed.
   * @return {void}
   * @memberof CreateSurvey
   */
  ngOnDestroy(): void {
    this.theme.setLightMode(true);
    this.headerActions.setNarrow(false);
  }

  /**
   * @description Handles the event when a survey is created. Saves it via the service,
   * then delegates to success or error handling depending on the result.
   * @param {Survey} survey - The survey that was created.
   * @return {Promise<void>} - Resolves once the save attempt has been handled, either as success or error.
   * @memberof CreateSurvey
   */
  async onSurveyCreated(survey: Survey): Promise<void> {
    try {
      await this.surveysService.addSurvey(survey);
      this.handlePublishSuccess();
    } catch (error) {
      this.handlePublishError(error);
    }
  }

  /**
   * @description Shows a success notification and navigates back to the home page after a short delay.
   * @private
   * @return {void}
   * @memberof CreateSurvey
   */
  private handlePublishSuccess(): void {
    this.notifications.show('Your survey is published');
    setTimeout(() => this.router.navigate(['/']), REDIRECT_DELAY_MS);
  }

  /**
   * @description Logs the error and shows an error notification, so the user knows
   * the survey was not saved and can try publishing again.
   * @private
   * @param {unknown} error - The error thrown while saving the survey.
   * @return {void}
   * @memberof CreateSurvey
   */
  private handlePublishError(error: unknown): void {
    console.error('Could not publish survey:', error);
    this.notifications.show(
      'Could not publish your survey. Please try again.',
      ERROR_NOTIFICATION_DURATION_MS,
    );
  }
}
