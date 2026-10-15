/**
 * @description Returns today's date as text in the format YYYY-MM-DD (local time).
 * This is the format that <input type="date"> expects.
 * @export
 * @return {string} - Today's date in the format YYYY-MM-DD.
 */
export function todayAsIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
