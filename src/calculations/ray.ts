import Vector2D from "./vector";
import NumericRange from "./numericRange";

export class Ray {
    direction: Vector2D;
    initial_point: Vector2D;
    constructor(direction: Vector2D, initial_point: Vector2D) {
        if (direction.length() == 0)
            throw TypeError(
                "The direction vector of a ray cannot be the zero vector.",
            );
        this.direction = direction;
        this.initial_point = initial_point;
    }

    getPoint(scalar: number): Vector2D | null {
        if (scalar < 0) return null;
        const result = new Vector2D(this.direction.x, this.direction.y);
        result.scale(scalar);
        result.add(this.initial_point);
        return result;
    }

    getPointAtDistance(distance: number): Vector2D | null {
        return this.getPoint(distance / this.direction.length());
    }

    getParameterRange(t1: number, t2: number): NumericRange | null {
        if (t1 < 0 && t2 < 0) return null;

        let tMin = Math.min(t1, t2);
        const tMax = Math.max(t1, t2);

        if (tMin < 0) tMin = 0;

        return new NumericRange(tMin, tMax);
    }
}
