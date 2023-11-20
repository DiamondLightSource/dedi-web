export interface Detector {
  resolution: { height: number; width: number };
  pixelSize: { height: number; width: number };
}

export interface SimpleVector2 {
  x?: number | null;
  y?: number | null;
}

export interface CircularDevice {
  centre: SimpleVector2;
  diameter: number;
}

export interface Beamstop extends CircularDevice {
  clearance: number | null;
}

export interface BeamlineConfig {
  angle: number | null;
  cameraLength: number | null;
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
  wavelength: number | null;
  cameraLengthStep: number;
}
