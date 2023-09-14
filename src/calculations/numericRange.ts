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
  containsValue(value: number): boolean {
    return value >= this.min && value <= this.max;
  }

  containsRange(other: NumericRange) {
    return other.min >= this.min && other.max <= this.min;
  }

  toString(): string {
    return `(min:${this.min}, max:${this.max})`;
  }

  intersect(other: NumericRange | null): NumericRange | null {
    if (other === null) {
      return null
    }
    if (other.min > this.max || this.min > other.max) return null;

    return new NumericRange(
      Math.max(other.min, this.min),
      Math.min(other.max, this.max),
    );
  }

  equals(other: NumericRange): boolean {
    return this.min === other.min && this.max === other.max;
  }
}
