import { Unit } from "mathjs";

/**
 * Represnts a simple vector
 */
export interface SimpleVector2 {
  x?: number | null;
  y?: number | null;
}

/**
 *  Internal Detector type
 */
export interface AppDetector {
  readonly resolution: { height: number; width: number };
  readonly pixelSize: { height: Unit; width: Unit };
  readonly mask?: DetectorMask;
}

/**
 * Internal Circular Device (eg Camera Tube or Beamstop)
 */
export interface AppCircularDevice {
  centre: SimpleVector2;
  diameter: Unit;
}

/**
 * Internal Beamstop type
 */
export interface AppBeamstop extends AppCircularDevice {
  clearance: number | null;
}

/**
 * Internal Beamline type (contains all immutable information about a beamline)
 */
export interface AppBeamline {
  readonly beamstopDiameter: number;
  readonly cameratubeDiameter: number;
  readonly minWavelength: Unit;
  readonly maxWavelength: Unit;
  readonly minCameraLength: Unit;
  readonly maxCameraLength: Unit;
  readonly cameraLengthStep: Unit;
}

/**
 * Internal Full AppConfig
 */
export interface AppConfig {
  detector: string;
  beamstop: AppBeamstop;
  cameraTube: AppCircularDevice;
  beamline: string;
  wavelength: Unit;
  angle: Unit;
  cameraLength: number | null;
}

/**
 * External Detector type used in IO
 */
export interface IODetector {
  readonly resolution: { height: number; width: number };
  readonly pixelSize: { height: number; width: number };
  readonly mask?: DetectorMask;
}

/**
 * External CircularTube type used in IO
 */
export interface IOCircularDevice {
  readonly centre: SimpleVector2;
}

/**
 * External Beamline type for use in
 */
export interface IOBeamline {
  readonly beamstopDiameter: number;
  readonly cameratubeDiameter: number;
  readonly minWavelength: number;
  readonly maxWavelength: number;
  readonly minCameraLength: number;
  readonly maxCameraLength: number;
  readonly cameraLengthStep: number;
}

/**
 * External Beamstop type
 */
export interface IOBeamstop extends IOCircularDevice {
  readonly clearance: number | null;
}

/**
 * External Preset Config type
 */
export interface IOPresetConfig {
  readonly detector: string;
  readonly beamline: string;
  readonly beamstop: IOBeamstop;
  readonly cameraTube: IOCircularDevice;
}

export interface BeamlineConfig {
  beamline: AppBeamline;
  wavelength: Unit;
  angle: Unit;
  cameraLength: number | null;
}

export interface DetectorMask {
  readonly horizontalModules: number;
  readonly verticalModules: number;
  readonly horizontalGap: number;
  readonly verticalGap: number;
  readonly missingModules?: number[];
}
