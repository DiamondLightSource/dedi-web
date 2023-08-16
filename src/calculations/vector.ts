
export default class Vector2D {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vector: Vector2D): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    scale(value: number): void {
        this.y *= value;
        this.x *= value;
    }

    length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
