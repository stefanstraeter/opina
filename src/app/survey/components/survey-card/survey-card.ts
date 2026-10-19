import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowIcon } from '@shared/components/arrow-icon/arrow-icon';
import { formatPositionNumber } from '@shared/utils/position-number';
import { ClockIcon } from '@shared/components/clock-icon/clock-icon';
import {
  getBadgeInfo,
  getBadgeText,
  isUrgentBadge,
} from '@survey/rules/deadline-badge';

@Component({
  imports: [RouterLink, ArrowIcon, ClockIcon],
  selector: 'app-survey-card',
  styleUrl: './survey-card.scss',
  templateUrl: './survey-card.html',
})
export class SurveyCard {
  id = input.required<number>();
  category = input.required<string>();
  title = input.required<string>();
  deadline = input.required<string | null>();
  variant = input<'highlight' | 'list'>('list');
  number = input<number | null>(null);
  formattedNumber = computed(() => this.buildNumberText(this.number()));
  badgeInfo = computed(() => getBadgeInfo(this.deadline()));
  badgeText = computed(() => getBadgeText(this.badgeInfo()));
  isUrgent = computed(() => isUrgentBadge(this.badgeInfo()));

  /**
   * @description Turns the position of the card into a two-digit text, so 1
   * becomes "01".
   * @private
   * @param {number | null} position - The position, or null if there is none.
   * @return {string} - The text for the number, empty if there is no position.
   * @memberof SurveyCard
   */
  private buildNumberText(position: number | null): string {
    if (position === null) return '';
    return formatPositionNumber(position);
  }
}
