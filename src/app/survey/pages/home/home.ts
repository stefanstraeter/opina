import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderActions } from '@core/services/header-actions';
import { HeroIllustration } from '@survey/components/hero-illustration/hero-illustration';
import { SurveysOverview } from '@survey/components/surveys-overview/surveys-overview';
import { Button } from '@shared/components/button/button';

@Component({
  imports: [Button, HeroIllustration, SurveysOverview, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  private headerActions = inject(HeaderActions);

  /**
   * @description Shows the "Create survey" button in the header while the
   * home page is open.
   * @return {void}
   * @memberof Home
   */
  ngOnInit(): void {
    this.headerActions.setCreateSurveyButtonVisible(true);
  }

  /**
   * @description Hides the header button again when the home page is left.
   * @return {void}
   * @memberof Home
   */
  ngOnDestroy(): void {
    this.headerActions.setCreateSurveyButtonVisible(false);
  }
}
