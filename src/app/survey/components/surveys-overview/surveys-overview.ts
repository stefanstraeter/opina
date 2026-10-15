import { Component, computed, inject, signal } from '@angular/core';
import { SurveyCard } from '@survey/components/survey-card/survey-card';
import { Button } from '@shared/components/button/button';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { SURVEY_CATEGORIES } from '@survey/model/constants/survey-categories';
import { Surveys } from '@survey/services/surveys';
import { filterSurveys, SurveyStatusFilter } from '@survey/rules/survey-filter';
import { todayAsIsoDate } from '@shared/utils/date';

/**
 * @description The SurveysOverview component displays a list of surveys,
 * allowing users to filter them by status (active or ended) and category.
 * It uses the Surveys service to fetch survey data and applies filtering
 * logic defined in the survey-filter module.
 * @export
 * @class SurveysOverview
 */
@Component({
  imports: [SurveyCard, Button, Dropdown],
  selector: 'app-surveys-overview',
  styleUrl: './surveys-overview.scss',
  templateUrl: './surveys-overview.html',
})
export class SurveysOverview {
  private surveysService = inject(Surveys);
  surveys = this.surveysService.surveys;
  endingSoonSurveys = this.surveysService.endingSoonSurveys;
  selectedCategory = signal('all');
  activeFilter = signal<SurveyStatusFilter>('active');
  filteredSurveys = computed(() =>
    filterSurveys(
      this.surveys(),
      this.activeFilter(),
      this.selectedCategory(),
      todayAsIsoDate(),
    ),
  );

  /**
   * @description Sets the active filter for surveys, either 'active' or 'ended'.
   * @param {SurveyStatusFilter} filter
   * @memberof SurveysOverview
   */
  setFilter(filter: SurveyStatusFilter): void {
    this.activeFilter.set(filter);
  }
  /**
   * @description The options for the category dropdown, including "All Surveys" and the predefined survey categories.
   * @type {DropdownOption[]}
   * @memberof SurveysOverview
   */
  categoryOptions: DropdownOption[] = [
    { value: 'all', label: 'All Surveys' },
    ...SURVEY_CATEGORIES,
  ];
}
