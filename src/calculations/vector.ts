/**
 * A Simple vector class to store the x and y coordinate of a vector in 2d space
 */
export default class Vector2D {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Sums two vectors together
   * @param vector 
   */
  add(vector: Vector2D): void {
    this.x += vector.x;
    this.y += vector.y;
  }

  /**
   * Scales the vector ny some scalar value
   * @param value 
   */
  scale(value: number): void {
    this.y *= value;
    this.x *= value;
  }

  /**
   * Returns the euclidean norm of the vector
   * @returns 
   */
  length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Tests equality between two vectors
   * @param other Another Vector2D object
   * @returns boolean 
   */
  equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Serialises a Vector2D object
   * @returns 
   */
  toString(): string {
    return `(x:${this.x}, y:${this.y})`;
  }
}
