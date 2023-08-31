export interface Detector {
  resolution: { height: number; width: number };
  pixel_size: number;
}

export interface SerialisedVector2 {
  x:number;
  y:number;
}

export interface CircularDevice {
  centre: SerialisedVector2;
  diameter: number;
}

export interface BeamlineConfig {
  detector: string;
  beamstop: CircularDevice;
  cameraTube: CircularDevice;
  angle: number | null;
  cameraLength: number;
  clearance: number; // remember to do int checks on this value
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
}
