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
   * Returns true if a value falls inside the numeric range
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
}
