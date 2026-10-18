import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowIcon } from '@shared/components/arrow-icon/arrow-icon';
import { ClockIcon } from '@shared/components/clock-icon/clock-icon';
import {
  BadgeInfo,
  getBadgeInfo,
  isUrgentBadge,
} from '@survey/rules/deadline-badge';

const NUMBER_DIGITS = 2;

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
  badgeText = computed(() => this.buildBadgeText(this.badgeInfo()));
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
    return String(position).padStart(NUMBER_DIGITS, '0');
  }

  /**
   * @description Turns the stage into the text that is shown on the badge.
   * The texts are fixed, so a switch fits here.
   * @private
   * @param {BadgeInfo} badgeInfo - The stage and amount of the badge.
   * @return {string} - The text that is shown on the badge.
   * @memberof SurveyCard
   */
  private buildBadgeText({ stage, amount }: BadgeInfo): string {
    switch (stage) {
      case 'none':
        return 'No end date';
      case 'expired':
        return 'Survey expired';
      case 'today':
        return 'Ends today';
      case 'days':
        return `Ends In ${amount} ${amount === 1 ? 'Day' : 'Days'}`;
      case 'months':
        return `Ends In ${amount} ${amount === 1 ? 'Month' : 'Months'}`;
    }
  }
}
