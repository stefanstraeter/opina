const POSITION_DIGITS = 2;

/**
 * @description Turns a position into a two-digit text, so 1 becomes "01".
 * Used for the numbers on cards and in front of questions.
 * @export
 * @param {number} position - The position, starting at 1.
 * @return {string} - The position with a leading zero if needed.
 */
export function formatPositionNumber(position: number): string {
  return String(position).padStart(POSITION_DIGITS, '0');
}
