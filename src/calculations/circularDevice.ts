import Vector2D from "./vector";

/**
 * Represents devices which have a circular profile such as a beam stop or camera
 */
export interface CircularDevice {
  centre: Vector2D;
  diameter: number;
}