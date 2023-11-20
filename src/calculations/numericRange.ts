/**
 * An object that stores a numeric range
 */
export default class NumericRange {
  min: number;
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;

    if (min > max) {
      const temp = max;
      this.max = min;
      this.min = temp;
    }
  }
  /**
   * Returns true if the input value falls inside the numeric range
   * @param value a number
   * @returns
   */
  containsValue(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  /**
   * Returns true if another range falls inside the numeric range
   * @param other another range
   * @returns
   */
  containsRange(other: NumericRange): boolean {
    return other.min >= this.min && other.max <= this.max;
  }

  /**
   * Returns string represtaion of the numeric range
   * @returns
   */
  toString(): string {
    return `(min:${this.min}, max:${this.max})`;
  }

  /**
   * Returns the intersection of the numric range and another numeric range
   * @param other another numeric range
   * @returns the intersection of the two ranges
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
   * Returns true if the neumeric ranges are equal
   * @param other another numeric range
   * @returns
   */
  equals(other: NumericRange): boolean {
    return this.min === other.min && this.max === other.max;
  }

  /**
   * Returns a new numeric range with the function applied elementwise
   * @param func A function to apply to both the min and max of the range
   * @returns A new Numeric range with the call back applied
   */
  apply(func: (value: number) => number): NumericRange {
    return new NumericRange(func(this.min), func(this.max));
  }

  /**
   * Applys a function to the range in place
   * @param func
   * @returns
   */
  inPlaceApply(func: (value: number) => number): NumericRange {
    this.min = func(this.min);
    this.max = func(this.max);
    return this;
  }

  /**
   * Create a new numeric range from a num max and a funtion
   * @param min
   * @param max
   * @param func
   * @returns
   */
  static createWithFunc(
    min: number,
    max: number,
    func: (value: number) => number,
  ): NumericRange {
    return new NumericRange(func(min), func(max));
  }
}
