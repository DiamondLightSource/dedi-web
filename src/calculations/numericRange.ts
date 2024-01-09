/**
 * A class which represents a unitless numeric range by storing it's minimum and maximum numbers
 */
export default class NumericRange {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;

    // Note the class does not preserve the users choice of which input is which
    if (min > max) {
      const temp = max;
      this.max = min;
      this.min = temp;
    }
  }

  /**
   * Checks if the range contains the input value
   * @param value - input number
   * @returns
   */
  containsValue(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  /**
   * Checks if the range contains the input NumericRange
   * @param other - input NumericRange
   * @returns
   */
  containsRange(other: NumericRange): boolean {
    return other.min >= this.min && other.max <= this.max;
  }

  /**
   * Finds the intersection of this range and another.
   * @param other
   * @returns The intersection NumericRange or null
   */
  intersect(other: NumericRange | null): NumericRange | null {
    if (other === null) {
      return null;
    }
    if (other.min > this.max || this.min > other.max) return null;

    return new NumericRange(
      Math.max(other.min, this.min),
      Math.min(other.max, this.max),
    );
  }

  /**
   * Creates a new Numeric Range by applying the function func to min and max
   * @param func - A function to apply to the min and max value
   * @returns - The output range
   */
  apply(func: (value: number) => number): NumericRange {
    return new NumericRange(func(this.min), func(this.max));
  }

  /**
   * Applies the function func to min and max members of NumericRange inplace
   * @param func
   * @returns
   */
  applyInPlace(func: (value: number) => number): NumericRange {
    this.min = func(this.min);
    this.max = func(this.max);
    return this;
  }

  toString(): string {
    return `(min:${this.min}, max:${this.max})`;
  }

  equals(other: NumericRange): boolean {
    return this.min === other.min && this.max === other.max;
  }
}
