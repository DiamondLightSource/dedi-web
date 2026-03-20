import { unit } from "mathjs";
import detectorData from "./detectors.json";
import presetConfigData from "./presetConfigs.json";
import calibrantData from "./calibrant.json";
import {
  AppBeamline,
  AppDetector,
  AppConfig,
  IOBeamline,
  IODetector,
  Calibrant,
  IOBeamstop,
  AppBeamstop,
  IOCircularDevice,
  AppCircularDevice,
  IOWavelengthLimits,
  AppWavelengthLimits,
  AppCameraLimits,
  IOCameraLimits,
} from "../utils/types";
import { AngleUnits, LengthUnits, WavelengthUnits } from "../utils/units";

/** Convert a serialised detector into the internal representation with mathjs units. */
export function createInternalDetector(detectorData: IODetector): AppDetector {
  return {
    ...detectorData,
    pixelSize: {
      height: unit(detectorData.pixelSize.height, LengthUnits.millimetre),
      width: unit(detectorData.pixelSize.width, LengthUnits.millimetre),
    },
  };
}

/** Convert a serialised beamstop into the internal representation with mathjs units. */
export function createInternalBeamstop(beamstop: IOBeamstop): AppBeamstop {
  return {
    ...beamstop,
    diameter: unit(beamstop.diameter, LengthUnits.millimetre),
  };
}

/** Convert a serialised camera tube into the internal representation, returning undefined if absent. */
export function createInternalCameraTube(
  cameraTube?: IOCircularDevice,
): AppCircularDevice | undefined {
  if (!cameraTube) return undefined;
  return {
    ...cameraTube,
    diameter: unit(cameraTube.diameter, LengthUnits.millimetre),
  };
}

/** Convert serialised wavelength limits (nm) into mathjs Unit pairs. */
export function createInternalWavelengthLimits(
  limits: IOWavelengthLimits,
): AppWavelengthLimits {
  return {
    min: unit(limits.min, WavelengthUnits.nanometres),
    max: unit(limits.max, WavelengthUnits.nanometres),
  };
}

export function createInternalCameraLimits(
  limits: IOCameraLimits,
): AppCameraLimits {
  return {
    min: unit(limits.min, LengthUnits.metre),
    max: unit(limits.max, LengthUnits.metre),
    step: unit(limits.step, LengthUnits.metre),
  };
}

/**
 * Convert a serialised beamline preset into an AppBeamline.
 * Wavelength starts as NaN (not yet set by user) and angle defaults to 90°.
 */
export function createInternalBeamline(beamline: IOBeamline): AppBeamline {
  return {
    wavelengthLimits: createInternalWavelengthLimits(beamline.wavelengthLimits),
    cameraLimits: createInternalCameraLimits(beamline.cameraLengthLimits),
    wavelength: unit(NaN, WavelengthUnits.nanometres),
    angle: unit(90, AngleUnits.degrees),
    cameraLength: beamline.cameraLengthLimits.min,
  };
}

/** Build a full AppConfig from a serialised beamline preset. */
export function createAppConfig(beamline: IOBeamline): AppConfig {
  return {
    detector: beamline.detector,
    beamstop: createInternalBeamstop(beamline.beamstop),
    cameraTube: createInternalCameraTube(beamline.cameraTube),
    beamline: createInternalBeamline(beamline),
  };
}

export const detectorRecord: Record<string, AppDetector> = Object.fromEntries(
  Object.entries(detectorData as Record<string, IODetector>).map(
    ([key, value]) => [key, createInternalDetector(value)],
  ),
);

export const presetConfigRecord = presetConfigData as Record<
  string,
  IOBeamline
>;

export const defaultConfig = createAppConfig(
  presetConfigRecord[Object.keys(presetConfigRecord)[0]],
);

export const calibrantRecord = calibrantData as Record<string, Calibrant>;
