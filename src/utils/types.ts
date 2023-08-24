import { Vector2 } from "three";

export interface Detector {
  name: string;
  resolution: { height: number; width: number };
  pixel_size: { height: number; width: number };
}

export interface CircularDevice {
  centre: Vector2;
  diameter: number;
}

export interface BeamlineConfig {
  name: string | null
  detector: Detector;
  Beamstop: CircularDevice;
  CameraTube: CircularDevice;
  angle: number;
  cameraLength: number;
  clearance: number; // remember to do int checks on this value
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
}
