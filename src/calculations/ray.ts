import { Vector2 } from "three";
import NumericRange from "./numericRange";

/**
 * A class which represents a  ( geometric ) ray.
 */
export class Ray {
  direction: Vector2;
  initial_point: Vector2;

  /**
   * Create a ray object from an intial point and direction vector
   * @param direction Vector representing the direction of the ray
   * @param initial_point Vector representing the initial point of the ray
   */
  constructor(direction: Vector2, initial_point: Vector2) {
    if (direction.length() === 0)
      throw TypeError(
        "The direction vector of a ray cannot be the zero vector.",
      );
    this.direction = direction;
    this.initial_point = initial_point;
  }

  /**
   * Returns the point on the ray that corresponds to a the given scalar value.
   * @param scalar Given scalar value
   * @returns Point on the ray
   */
  public getPoint(scalar: number): Vector2 {
    const result = new Vector2(this.direction.x, this.direction.y);
    result.multiplyScalar(scalar);
    result.add(this.initial_point);
    return result;
  }

  /**
   * Get the point at a given distance from the initial point.
   * @param distance Given distance
   * @returns Point on the
   */
  getPointAtDistance(distance: number): Vector2 {
    return this.getPoint(distance / this.direction.length());
  }

  /**
   * Takes an arbitrary closed interval,
   * and restricts it to the interval [0, infinity]
   * @param t1 Interval endpoint 1
   * @param t2 Interval endpoint 2
   * @returns Restricted numeric range
   */
  static getParameterRange(t1: number, t2: number): NumericRange {
    let tMin = Math.min(t1, t2);
    const tMax = Math.max(t1, t2);
    if (tMin < 0) tMin = 0;
    return new NumericRange(tMin, tMax);
  }

  /**
   * Gets the Numeric range of the scalars
   * of the intersection points of this ray and a circle.
   * @param radius Radius of the circle
   * @param centre Centre of the circle
   * @returns NumericRange of the intersection scalars
   */
  public getCircleIntersectionRange(
    radius: number,
    centre: Vector2,
  ): NumericRange | null {
    const diff = this.initial_point.clone().add(centre.multiplyScalar(-1));
    const a = this.direction.dot(this.direction);
    const b = 2 * diff.dot(this.direction);
    const c = diff.dot(diff) - Math.pow(radius, 2);
    const discriminant = Math.pow(b, 2) - 4 * a * c;

    if (discriminant < 0) return null;

    let t1: number;
    let t2: number;

    if (a !== 0) {
      t1 = (0.5 * (-b - Math.sqrt(discriminant))) / a;
      t2 = (0.5 * (-b + Math.sqrt(discriminant))) / a;
      return Ray.getParameterRange(t1, t2);
    }

    if (b === 0) {
      return c === 0 ? new NumericRange(0, Number.POSITIVE_INFINITY) : null;
    }
    t1 = -c / b;
    t2 = -c / b;
    return Ray.getParameterRange(t1, t2);
  }

  /**
   * Get the scalars of the intersection points of a rectangle with the ray.
   * @param topLeftCorner Top left corner of the rectangle
   * @param width Width of the rectangle
   * @param height Height of the rectangle
   * @returns NumericRange of the scalars
   */
  public getRectangleIntersectionRange(
    topLeftCorner: Vector2,
    dimensions: Vector2,
  ): NumericRange | null {
    let result: NumericRange | null;
    const xmax = topLeftCorner.x + dimensions.x;
    const xmin = topLeftCorner.x;
    const ymax = topLeftCorner.y;
    const ymin = topLeftCorner.y - dimensions.y;

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
      return Ray.getParameterRange(result.min, result.max);
    }

    result = result.intersect(
      new NumericRange(
        (ymin - this.initial_point.y) / this.direction.y,
        (ymax - this.initial_point.y) / this.direction.y,
      ),
    );

    if (result == null) {
      return null;
    }

    return Ray.getParameterRange(result.min, result.max);
  }
}
