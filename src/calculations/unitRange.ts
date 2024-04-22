import * as mathjs from "mathjs";
import NumericRange from "./numericRange";

/**
 * A class which represents a numeric range with units
 * by storing it's minimum and maximum values with units.
 */
export default class UnitRange {
  min: mathjs.Unit;
  max: mathjs.Unit;

  constructor(min: mathjs.Unit, max: mathjs.Unit) {
    this.min = min;
    this.max = max;

    if (!min.equalBase(max)) {
      throw new TypeError(
        "min and max units must be same base length, mass, etc",
      );
    }

    if (mathjs.larger(min, max)) {
      const temp = max;
      this.max = min;
      this.min = temp;
    }
  }

  /**
   * Creates a new UnitRange with the units converted to the input unit string.
   * 
   * @remarks To learn about the unit strings refer to 
   * https://mathjs.org/docs/datatypes/units.html
   * 
   * @param units Unit name to convert too
   * @returns Unit range object with converted units
   */
  to(units: string): UnitRange {
    return new UnitRange(this.min.to(units), this.max.to(units));
  }

  /**
   * Checks if the range contains the input Unit.
   * @param value Input Unit
   * @returns
   */
  containsValue(value: mathjs.Unit): boolean {
    const result =
      mathjs.largerEq(value, this.min) && mathjs.largerEq(value, this.max);
    if (!(typeof result == "boolean")) {
      throw TypeError("Can only check one value at a time");
    }
    return result;
  }

  /**
   * Checks if the this UnitRange contains the Input UnitRange
   * @param other Input UnitRange
   * @returns
   */
  containsRange(other: UnitRange): boolean {
    const result =
      mathjs.smallerEq(this.min, other.min) &&
      mathjs.largerEq(this.max, other.max);
    if (!(typeof result == "boolean")) {
      throw TypeError("Can only check one value at a time");
    }
    return result;
  }

  /**
   * Finds the intersection of this range the input range.
   * @param other Input UnitRange
   * @returns
   */
  intersect(other: UnitRange): UnitRange | null {
    if (
      mathjs.larger(other.min, this.max) ||
      mathjs.larger(this.min, other.max)
    )
      return null;

    return new UnitRange(
      mathjs.max(other.min, this.min),
      mathjs.min(other.max, this.max),
    );
  }

  /**
   * Creates a new UnitRange by applying the function func to min and max.
   * @param func A function to apply to the min and max value
   * @returns The New unit range
   */
  apply(func: (value: mathjs.Unit) => mathjs.Unit): UnitRange {
    return new UnitRange(func(this.min), func(this.max));
  }

  /**
   * Applies the function func to min and max members of UnitRange inplace.
   * @param func A function to apply to the min and max value
   * @returns
   */
  applyInPlace(func: (value: mathjs.Unit) => mathjs.Unit): UnitRange {
    this.min = func(this.min);
    this.max = func(this.max);

    if (mathjs.larger(this.min, this.max)) {
      const temp = this.max;
      this.max = this.min;
      this.min = temp;
    }
    
    return this;
  }

  /**
   * Creates a UnitRange from a Numeric range
   * 
   * @remarks To learn about the unit strings refer to 
   * https://mathjs.org/docs/datatypes/units.html
   * 
   * @param range Input NumericRange
   * @param units Unit name of range
   * @returns
   */
  static fromNumericRange(
    range: NumericRange | null,
    units: string,
  ): UnitRange {
    return new UnitRange(
      mathjs.unit(range?.min ?? NaN, units),
      mathjs.unit(range?.max ?? NaN, units),
    );
  }

  /**
   * Returns a string representation of this UnitRange.
   * @returns 
   */
  toString(): string {
    return `(min:${this.min.toString()}, max:${this.max.toString()})`;
  }

  
  /**
   * Check if this range is equal to the input range
   * @param other Another UnitRange 
   * @returns 
   */
  equals(other: UnitRange): boolean {
    const result =
      mathjs.equal(this.min, other.min) && mathjs.equal(this.max, other.max);
    if (!(typeof result == "boolean")) {
      throw TypeError("write this later");
    }
    return result;
  }
}
