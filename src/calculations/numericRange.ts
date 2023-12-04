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

  containsRange(other: NumericRange): boolean {
    return other.min >= this.min && other.max <= this.max;
  }


  toString(): string {
    return `(min:${this.min}, max:${this.max})`;
  }

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


  equals(other: NumericRange): boolean {
    return this.min === other.min && this.max === other.max;
  }


  apply(func: (value: number) => number): NumericRange {
    return new NumericRange(func(this.min), func(this.max));
  }


  inPlaceApply(func: (value: number) => number): NumericRange {
    this.min = func(this.min);
    this.max = func(this.max);
    return this;
  }

  static createWithFunc(
    min: number,
    max: number,
    func: (value: number) => number,
  ): NumericRange {
    return new NumericRange(func(min), func(max));
  }
}
