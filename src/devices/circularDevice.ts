import Vector2D from "../calculations/vector";

export interface CircularDevice {
  centre: Vector2D;
  diameter: number;
}

// rememeber i wont make beamstop or camera tube classes as they both just implement circular device

// this exists so that we can keep a record of the diameter in both mm diameter and px diameter
