import { Component, computed, inject, signal } from '@angular/core';
import { SurveyCard } from '@survey/components/survey-card/survey-card';
import { Button } from '@shared/components/button/button';
import { Dropdown, DropdownOption } from '@shared/components/dropdown/dropdown';
import { PaginationDots } from '@shared/components/pagination-dots/pagination-dots';
import { SURVEY_CATEGORIES } from '@survey/model/constants/survey-categories';
import { Surveys } from '@survey/services/surveys';
import { getActiveCardIndex } from '@survey/rules/active-card-index';
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
  imports: [SurveyCard, Button, Dropdown, PaginationDots],
  selector: 'app-surveys-overview',
  styleUrl: './surveys-overview.scss',
  templateUrl: './surveys-overview.html',
})
export class SurveysOverview {
  private surveysService = inject(Surveys);
  surveys = this.surveysService.surveys;
  endingSoonSurveys = this.surveysService.endingSoonSurveys;
  selectedCategory = signal('all');
  activeCardIndex = signal(0);
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

  /**
   * @description Remembers which "Ending soon" card is in view while the row is
   * scrolled, so the matching dot can be highlighted.
   * @param {Event} event - The scroll event of the card row.
   * @return {void}
   * @memberof SurveysOverview
   */
  updateActiveCard(event: Event): void {
    const row = event.target as HTMLElement;
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    const cardCount = this.endingSoonSurveys().length;
    this.activeCardIndex.set(
      getActiveCardIndex(row.scrollLeft, maxScrollLeft, cardCount),
    );
  }
}
