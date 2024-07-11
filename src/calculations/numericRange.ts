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

  /**
   * Creates a new Numeric Range by applying the function func to min and max
   * @param func A function to apply to the min and max value
   * @returns The output range
   */
  apply(func: (value: number) => number): NumericRange {
    return new NumericRange(func(this.min), func(this.max));
  }

  /**
   * Applies the function func to min and max members of NumericRange inplace
   * @param func - A function to apply to the min and max value
   * @returns The output range
   */
  applyInPlace(func: (value: number) => number): NumericRange {
    this.min = func(this.min);
    this.max = func(this.max);

    if (this.min > this.max) {
      const temp = this.max;
      this.max = this.min;
      this.min = temp;
    }

    return this;
  }

  /**
   * Returns a string representation of this range.
   * @returns
   */
  toString(): string {
    return `(min:${this.min}, max:${this.max})`;
  }

  /**
   * Check if this range is equal to the input range
   * @param other Another NumericRange
   * @returns
   */
  equals(other: NumericRange): boolean {
    return this.min === other.min && this.max === other.max;
  }
}
