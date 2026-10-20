import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StatusBadge } from '@shared/components/status-badge/status-badge';
import { Button } from '@shared/components/button/button';
import { CloseIcon } from '@shared/components/close-icon/close-icon';
import { HeaderActions } from '@core/services/header-actions';
import { Theme } from '@core/services/theme';
import { ConfirmationData, Notifications } from '@core/services/notifications';
import { Survey } from '@survey/model/interfaces/survey';
import { buildPublishedInfo } from '@survey/rules/published-info';
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
  private destroyRef = inject(DestroyRef);

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
      this.handlePublishSuccess(survey);
    } catch (error) {
      this.handlePublishError(error);
    }
  }

  /**
   * @description Shows the confirmation card for the published survey and navigates back to the home page after a short delay.
   * @private
   * @param {Survey} survey - The survey that was published.
   * @return {void}
   * @memberof CreateSurvey
   */
  private handlePublishSuccess(survey: Survey): void {
    this.notifications.showConfirmation(
      this.buildConfirmation(survey),
      REDIRECT_DELAY_MS,
    );
    const redirectTimer = setTimeout(
      () => this.router.navigate(['/']),
      REDIRECT_DELAY_MS,
    );
    this.destroyRef.onDestroy(() => clearTimeout(redirectTimer));
  }

  /**
   * @description Builds the content of the confirmation card for a published survey.
   * @private
   * @param {Survey} survey - The survey that was published.
   * @return {ConfirmationData} - The content of the card.
   * @memberof CreateSurvey
   */
  private buildConfirmation(survey: Survey): ConfirmationData {
    return {
      tone: 'success',
      eyebrow: 'Published',
      headline: 'Your survey is live.',
      text: 'Everyone can now share their opinion. Results update as answers come in.',
      category: survey.category,
      title: survey.title,
      info: buildPublishedInfo(survey),
      infoAsBadge: false,
      isInfoUrgent: false,
    };
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
