import { Unit, unit, multiply, subtract, add, divide } from "mathjs";
import { Vector2, Vector3 } from "three";

/**
 * A class to hold a vector of unit objects (note units of x and y can be
 * different at any given time)
 */
export class UnitVector {
  x: Unit;
  y: Unit;
  /**
   * Creates unitRange from x value, y values and unit string
   * @param x
   * @param y
   * @param unitString
   * @returns
   */
  static fromNumbers(x: number, y: number, unitString: string): UnitVector {
    return new this(unit(x, unitString), unit(y, unitString));
  }

  constructor(x: Unit, y: Unit) {
    this.x = x;
    this.y = y;
  }

  multiply(other: UnitVector | Vector3 | Vector2): UnitVector {
    const newx = multiply(this.x, other.x);
    if (typeof newx === "number" || !("units" in newx)) {
      throw TypeError("Units of unit vector may be incorrect");
    }
    this.x = newx;

    const newy = multiply(this.y, other.y);
    if (typeof newy === "number" || !("units" in newy)) {
      throw TypeError("");
    }
    this.y = newy;

    return this;
  }

  subtract(other: UnitVector): UnitVector {
    this.x = subtract(this.x, other.x);
    this.y = subtract(this.y, other.y);
    return this;
  }

  divivdeByScalar(scalar: number): UnitVector {
    this.x = divide(this.x, scalar);
    this.y = divide(this.y, scalar);
    return this;
  }

  add(other: UnitVector): UnitVector {
    this.x = add(this.x, other.x);
    this.y = add(this.y, other.y);
    return this;
  }

  toVector2(): Vector2 {
    return new Vector2(this.x.toNumber(), this.y.toNumber());
  }
  toVector3(z: number): Vector3 {
    return new Vector3(this.x.toNumber(), this.y.toNumber(), z);
  }

  to(unitString: string): UnitVector {
    this.x = this.x.to(unitString);
    this.y = this.y.to(unitString);
    return this;
  }

  toSI(): UnitVector {
    return new UnitVector(this.x.toSI(), this.y.toSI());
  }

  clone(): UnitVector {
    return new UnitVector(this.x, this.y);
  }
}
