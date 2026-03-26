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
   * Checks if this UnitRange contains the input UnitRange.
   * @param other Input UnitRange
   * @returns
   */
  containsRange(other: UnitRange): boolean {
    const result =
      mathjs.smallerEq(this.min, other.min) &&
      mathjs.largerEq(this.max, other.max);
    if (!(typeof result == "boolean")) {
      throw TypeError("Can only check one range at a time");
    }
    return result;
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
   * Creates a new UnitRange by applying the function func to min and max.
   * @param func A function to apply to the min and max value
   * @returns The new UnitRange
   */
  apply(func: (value: mathjs.Unit) => mathjs.Unit): UnitRange {
    return new UnitRange(func(this.min), func(this.max));
  }
}
