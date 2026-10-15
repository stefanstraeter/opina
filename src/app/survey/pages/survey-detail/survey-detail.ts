import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderActions } from '@core/services/header-actions';
import { NotFound } from '@shared/components/not-found/not-found';
import { Survey } from '@survey/model/interfaces/survey';
import { VoteCard } from '@survey/components/vote-card/vote-card';
import { SurveyResults } from '@survey/components/survey-results/survey-results';
import { Surveys } from '@survey/services/surveys';
import { applyVoteChange } from '@survey/rules/apply-vote-change';
import { hasVotedForSurvey } from '@survey/services/vote-storage';

@Component({
  imports: [VoteCard, SurveyResults, NotFound],
  selector: 'app-survey-detail',
  styleUrl: './survey-detail.scss',
  templateUrl: './survey-detail.html',
})
export class SurveyDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private surveys = inject(Surveys);
  private headerActions = inject(HeaderActions);
  private destroyRef = inject(DestroyRef);

  survey = signal<Survey | undefined>(undefined);
  isLoading = signal(true);
  previewAnswerIds = signal<number[]>([]);

  /**
   * @description Shows the "Create survey" button in the header, loads the
   * survey by id and starts listening to vote changes when the component is
   * initialized.
   * @return {void}
   * @memberof SurveyDetail
   */
  ngOnInit(): void {
    this.headerActions.setCreateSurveyButtonVisible(true);
    const id = this.getSurveyId();
    this.loadSurvey(id);
    this.listenToVoteChanges();
  }

  /**
   * @description Hides the "Create survey" button in the header when the
   * component is destroyed.
   * @return {void}
   * @memberof SurveyDetail
   */
  ngOnDestroy(): void {
    this.headerActions.setCreateSurveyButtonVisible(false);
  }

  /**
   * @description Loads the survey with the given id from the service and writes it
   * into the survey signal (undefined if it could not be loaded). An id that is
   * not a number is not sent to the database at all. Sets isLoading to false
   * afterwards, whether loading worked or not.
   * @private
   * @param {number} id
   * @return {Promise<void>} - Resolves when the survey is loaded and isLoading is false.
   * @memberof SurveyDetail
   */
  private async loadSurvey(id: number): Promise<void> {
    const isIdInvalid = Number.isNaN(id);
    if (isIdInvalid) {
      this.isLoading.set(false);
      return;
    }
    try {
      const loadedSurvey = await this.surveys.getSurveyById(id);
      this.survey.set(loadedSurvey);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * @description Reads the survey id from the current URL (route /survey/:id).
   * Returns NaN if the id in the URL is not a number.
   * @private
   * @return {number}
   * @memberof SurveyDetail
   */
  private getSurveyId(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  /**
   * @description Remembers the answers the user currently has selected in the
   * vote card, so the results can show them as a preview.
   * @param {number[]} answerIds - The ids of all selected answers.
   * @return {void}
   * @memberof SurveyDetail
   */
  updatePreview(answerIds: number[]): void {
    this.previewAnswerIds.set(answerIds);
  }

  /**
   * @description Starts listening to vote changes in Supabase and writes them
   * into the survey signal. Stops automatically when the component is destroyed.
   * @private
   * @return {void}
   * @memberof SurveyDetail
   */
  private listenToVoteChanges(): void {
    const stopListening = this.surveys.subscribeToVoteChanges(
      (answerId, votes) => this.handleVoteChange(answerId, votes),
    );
    this.destroyRef.onDestroy(stopListening);
  }

  /**
   * @description Writes the new votes of one answer into the survey signal,
   * so the results update live. Does nothing as long as no survey is loaded.
   * If this browser has already voted, the answer also leaves the preview,
   * so the own vote is not counted twice.
   * @private
   * @param {number} answerId - The id of the answer whose votes changed.
   * @param {number} votes - The new number of votes of this answer.
   * @return {void}
   * @memberof SurveyDetail
   */
  private handleVoteChange(answerId: number, votes: number): void {
    this.survey.update((current) =>
      current ? applyVoteChange(current, answerId, votes) : current,
    );
    const surveyId = this.survey()?.id;
    const hasVoted = surveyId !== undefined && hasVotedForSurvey(surveyId);
    if (hasVoted) {
      this.endPreviewFor(answerId);
    }
  }

  /**
   * @description Removes one answer from the preview, because its real votes
   * from the database are known now. Otherwise the vote would count twice.
   * @private
   * @param {number} answerId - The id of the answer that leaves the preview.
   * @return {void}
   * @memberof SurveyDetail
   */
  private endPreviewFor(answerId: number): void {
    this.previewAnswerIds.update((ids) => ids.filter((id) => id !== answerId));
  }
}
