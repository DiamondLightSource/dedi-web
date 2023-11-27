import { Unit } from "mathjs";

export interface Detector {
  readonly resolution: { height: number; width: number };
  readonly pixelSize: { height: Unit; width: Unit };
}

export interface SimpleVector2 {
  x?: number | null;
  y?: number | null;
}

export interface CircularDevice {
  centre: SimpleVector2;
  diameter: Unit;
}

export interface Beamstop extends CircularDevice {
  clearance: number | null;
}

export interface BeamlineConfig {
  angle: Unit;
  cameraLength: Unit;
  readonly minWavelength: Unit;
  readonly maxWavelength: Unit;
  readonly minCameraLength: Unit;
  readonly maxCameraLength: Unit;
  wavelength: Unit;
  readonly cameraLengthStep: Unit;
}
