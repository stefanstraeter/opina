/**
 * @description Finds out which card of a horizontal card row is the active one,
 * from how far the row is scrolled. At the start it is the first card, at the
 * end the last one, in between it is spread evenly.
 * @export
 * @param {number} scrollLeft - How far the row is scrolled from the left, in px.
 * @param {number} maxScrollLeft - The furthest the row can be scrolled, in px.
 * @param {number} cardCount - How many cards the row has.
 * @return {number} - The index of the active card, starting at 0.
 */
export function getActiveCardIndex(
  scrollLeft: number,
  maxScrollLeft: number,
  cardCount: number,
): number {
  const hasSeveralCards = cardCount > 1;
  const canScroll = maxScrollLeft > 0;
  if (!hasSeveralCards || !canScroll) {
    return 0;
  }
  const progress = scrollLeft / maxScrollLeft;
  return Math.round(progress * (cardCount - 1));
}
