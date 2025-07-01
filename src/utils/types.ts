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
  readonly diameter: number;
}

/**
 * External Beamstop type
 */
export interface IOBeamstop extends IOCircularDevice {
  readonly clearance: number | null;
}

export interface DetectorMask {
  readonly horizontalModules: number;
  readonly verticalModules: number;
  readonly horizontalGap: number;
  readonly verticalGap: number;
  readonly missingModules?: number[];
}

export interface Calibrant {
  readonly d: number[];
}

export interface IOCameraLimits {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

export interface AppCameraLimits {
  readonly min: Unit;
  readonly max: Unit;
  readonly step: Unit;
}

export interface IOWavelengthLimits {
  readonly min: number;
  readonly max: number;
}

export interface AppWavelengthLimits {
  readonly min: Unit;
  readonly max: Unit;
}

export interface IOBeamline {
  readonly detector: string;
  readonly beamstop: IOBeamstop;
  readonly cameraTube?: IOCircularDevice;
  readonly wavelengthLimits: IOWavelengthLimits;
  readonly cameraLengthLimits: IOCameraLimits;
}

export interface AppBeamline {
  readonly wavelengthLimits: AppWavelengthLimits;
  readonly cameraLimits: AppCameraLimits;
  wavelength: Unit;
  angle: Unit;
  cameraLength: number | null;
}

export interface AppConfig {
  detector: string;
  beamstop: AppBeamstop;
  cameraTube?: AppCircularDevice;
  beamline: AppBeamline;
}

export function sanitizeNumber(
  value: number | null | undefined,
): string | number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "";
  }
  return value;
}
