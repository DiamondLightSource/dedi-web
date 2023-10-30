import { Vector2 } from "three";
import NumericRange from "./numericRange";

export class Ray {
  direction: Vector2;
  initial_point: Vector2;
  constructor(direction: Vector2, initial_point: Vector2) {
    if (direction.length() == 0)
      throw TypeError(
        "The direction vector of a ray cannot be the zero vector.",
      );
    this.direction = direction;
    this.initial_point = initial_point;
  }

  getPoint(scalar: number): Vector2 {
    const result = new Vector2(this.direction.x, this.direction.y);
    result.multiplyScalar(scalar);
    result.add(this.initial_point);
    return result;
  }

  getPointAtDistance(distance: number): Vector2 {
    return this.getPoint(distance / this.direction.length());
  }

  getParameterRange(t1: number, t2: number): NumericRange {
    // look at this again
    let tMin = Math.min(t1, t2);
    const tMax = Math.max(t1, t2);

    if (tMin < 0) tMin = 0;

    return new NumericRange(tMin, tMax);
  }

  private getConicIntersectionParameterRange(
    coeffOfx2: number,
    coeffOfxy: number,
    coeffOfy2: number,
    coeffOfx: number,
    coeffOfy: number,
    constant: number,
  ) {
    let t1: number;
    let t2: number;

    const a =
      coeffOfx2 * Math.pow(this.direction.x, 2) +
      coeffOfxy * this.direction.x * this.direction.y +
      coeffOfy2 * Math.pow(this.direction.y, 2);

    const b =
      2 * coeffOfx2 * this.direction.x * this.initial_point.x +
      coeffOfxy *
        (this.direction.x * this.initial_point.y +
          this.direction.y * this.initial_point.x) +
      2 * coeffOfy2 * this.direction.y * this.initial_point.y +
      coeffOfx * this.direction.x +
      coeffOfy * this.direction.y;

    const c =
      coeffOfx2 * Math.pow(this.initial_point.x, 2) +
      coeffOfxy * this.initial_point.x * this.initial_point.y +
      coeffOfy2 * Math.pow(this.initial_point.y, 2) +
      coeffOfx * this.initial_point.x +
      coeffOfy * this.initial_point.y +
      constant;

    const discriminant = Math.pow(b, 2) - 4 * a * c;

    if (discriminant < 0) return null;
    if (a == 0) {
      if (b == 0)
        return c == 0 ? new NumericRange(0, Number.POSITIVE_INFINITY) : null;
      t1 = -c / b;
      t2 = -c / b;
    } else {
      t1 = (0.5 * (-b - Math.sqrt(discriminant))) / a;
      t2 = (0.5 * (-b + Math.sqrt(discriminant))) / a;
    }

    return this.getParameterRange(t1, t2);
  }

  private getEllipseIntersectionParameterRange(
    a: number,
    b: number,
    centre: Vector2,
  ) {
    const coeffOfx2 = 1 / Math.pow(a, 2);
    const coeffOfy2 = 1 / Math.pow(b, 2);
    const coeffOfx = (-2 * centre.x) / Math.pow(a, 2);
    const coeffOfy = (-2 * centre.y) / Math.pow(b, 2);
    const constant =
      Math.pow(centre.x, 2) / Math.pow(a, 2) +
      Math.pow(centre.y, 2) / Math.pow(b, 2) -
      1;

    return this.getConicIntersectionParameterRange(
      coeffOfx2,
      0,
      coeffOfy2,
      coeffOfx,
      coeffOfy,
      constant,
    );
  }

  public getCircleIntersectionParameterRange(radius: number, centre: Vector2) {
    return this.getEllipseIntersectionParameterRange(radius, radius, centre);
  }

  public getRectangleIntersectionParameterRange(
    topLeftCorner: Vector2,
    width: number,
    height: number,
  ): NumericRange | null {
    let result: NumericRange | null;
    const xmax = topLeftCorner.x + width;
    const xmin = topLeftCorner.x;
    const ymax = topLeftCorner.y;
    const ymin = topLeftCorner.y - height;

    if (this.direction.x === 0) {
      if (!new NumericRange(xmin, xmax).containsValue(this.initial_point.x))
        return null;
      result = new NumericRange(0, Number.POSITIVE_INFINITY);
    } else
      result = new NumericRange(
        (xmin - this.initial_point.x) / this.direction.x,
        (xmax - this.initial_point.x) / this.direction.x,
      );

    if (this.direction.y == 0) {
      if (!new NumericRange(ymin, ymax).containsValue(this.initial_point.y))
        return null;
      return this.getParameterRange(result.min, result.max);
    }
    result = result.intersect(
      new NumericRange(
        (ymin - this.initial_point.y) / this.direction.y,
        (ymax - this.initial_point.y) / this.direction.y,
      ),
    );
    return this.getParameterRange(result!.min, result!.max);
  }
}
