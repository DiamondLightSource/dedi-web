import { Vector2 } from "three";

/**
 * Represents devices which have a circular profile such as a beam stop or camera
 */
export interface CircularDevice {
  centre: Vector2;
  diameter: number;
}
