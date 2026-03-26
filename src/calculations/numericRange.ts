/**
 * A class which represents a unitless numeric range.
 */
export default class NumericRange {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;

    // Swap min and max if needed
    if (min > max) {
      const temp = max;
      this.max = min;
      this.min = temp;
    }
  }

  /**
   * Checks if an input number is contained in this range.
   * @param value - Input number
   * @returns
   */
  containsValue(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  /**
   * Checks if this range contains the input NumericRange.
   * @param input input NumericRange
   * @returns
   */
  containsRange(input: NumericRange): boolean {
    return input.min >= this.min && input.max <= this.max;
  }

  /**
   * Finds the intersection of this range and the input range. Or returns null
   * @param input input NumericRange
   * @returns
   */
  intersect(input: NumericRange | null): NumericRange | null {
    if (input === null) {
      return null;
    }
    if (input.min > this.max || this.min > input.max) return null;

    return new NumericRange(
      Math.max(input.min, this.min),
      Math.min(input.max, this.max),
    );
  }
}
