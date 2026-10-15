export type BadgeStage = 'none' | 'expired' | 'today' | 'days' | 'months';

export interface BadgeInfo {
  stage: BadgeStage;
  amount: number;
}

/**
 * @description Decides which stage the end date is in, and how big the amount is.
 * Up to 30 days: shown in days. Longer: shown in months (30 days = 1 month).
 * @export
 * @param {(string | null)} deadline - The end date in the format YYYY-MM-DD, or null if there is no end date.
 * @return {BadgeInfo} - The stage and amount of the badge.
 */
export function getBadgeInfo(deadline: string | null): BadgeInfo {
  if (!deadline) {
    return { stage: 'none', amount: 0 };
  }

  const days = daysUntil(deadline);

  if (days < 0) {
    return { stage: 'expired', amount: 0 };
  }
  if (days === 0) {
    return { stage: 'today', amount: 0 };
  }
  if (days <= 30) {
    return { stage: 'days', amount: days };
  }

  return { stage: 'months', amount: Math.floor(days / 30) };
}

/**
 * @description Counts the full days from today until the end date.
 * Both dates are set to midnight, so only the calendar day counts.
 * @param {string} deadline - The end date in the format YYYY-MM-DD.
 * @return {number} - The number of full days until the end date.
 */
function daysUntil(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(deadline + 'T00:00:00');

  return Math.round((end.getTime() - today.getTime()) / 86400000);
}
