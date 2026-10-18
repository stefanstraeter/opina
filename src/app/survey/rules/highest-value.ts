/**
 * @description Tells if a value is the highest of a list, so it can be shown
 * in the strong color. If several values share the top spot, all of them count.
 * If nobody has any votes (the highest is 0), nothing is highlighted.
 * @export
 * @param {number} value - The value to check.
 * @param {number[]} values - All values to compare with, including this one.
 * @return {boolean} - true if the value is the highest and above 0.
 */
export function isHighestValue(value: number, values: number[]): boolean {
  const highest = Math.max(...values);
  return highest > 0 && value === highest;
}
