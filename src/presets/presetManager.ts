import { unit } from "mathjs";
import detectorData from "./detectors.json";
import presetConfigData from "./presetConfigs.json";
import beamlineData from "./beamlines.json";
import {
  AppBeamline,
  AppDetector,
  AppConfig,
  IOBeamline,
  IODetector,
  IOPresetConfig,
} from "../utils/types";

/**
 * Creates an internal detector with pixel size units from an IODetector
 * @param detectorData IOdetector input
 * @returns AppDetector output
 */
export function createInternalDetector(detectorData: IODetector): AppDetector {
  return {
    ...detectorData,
    pixelSize: {
      height: unit(detectorData.pixelSize.height, "mm"),
      width: unit(detectorData.pixelSize.height, "mm"),
    },
  };
}

/**
 * Holds all the preset detectors as AppDetectors
 */
export const detectorRecord: Record<string, AppDetector> = Object.fromEntries(
  Object.entries(detectorData as Record<string, IODetector>).map(
    ([key, value]) => [key, createInternalDetector(value)],
  ),
);

/**
 * Creates an internal beamline with units from an IODetector
 * @param beamlineData Input IOBeamline
 * @returns AppBeamline with correct data
 */
export function createInternalBeamline(beamlineData: IOBeamline): AppBeamline {
  return {
    cameratubeDiameter: beamlineData.cameratubeDiameter,
    beamstopDiameter: beamlineData.beamstopDiameter,
    // Solution to units not being properly initialised
    minWavelength: unit(beamlineData.minWavelength, "nm").to("nm"),
    maxWavelength: unit(beamlineData.maxWavelength, "nm").to("nm"),
    minCameraLength: unit(beamlineData.minCameraLength, "m"),
    maxCameraLength: unit(beamlineData.maxCameraLength, "m"),
    cameraLengthStep: unit(beamlineData.cameraLengthStep, "m"),
  };
}

/**
 * Holds all the preset beamlines as AppBeamlines
 */
export const beamlineRecord: Record<string, AppBeamline> = Object.fromEntries(
  Object.entries(beamlineData as Record<string, IOBeamline>).map(
    ([key, value]) => [key, createInternalBeamline(value)],
  ),
);

/**
 * Creates internal AppConfig from IOPresetConfig
 * @param preset input IOPresetConfig
 * @returns
 */
function createPresetConfigRecord(preset: IOPresetConfig): AppConfig {
  return {
    ...preset,
    beamstop: {
      ...preset.beamstop,
      diameter: unit(beamlineRecord[preset.beamline].beamstopDiameter, "mm"),
    },
    cameraTube: {
      ...preset.cameraTube,
      diameter: unit(beamlineRecord[preset.beamline].cameratubeDiameter, "mm"),
    },
    wavelength: unit(NaN, "nm"),
    angle: unit(90, "deg"),
    cameraLength: beamlineRecord[preset.beamline].minCameraLength.toNumber("m"),
  };
}

/**
 * Holds the internal app configurations
 */
export const presetConfigRecord: Record<string, AppConfig> = Object.fromEntries(
  Object.entries(presetConfigData as Record<string, IOPresetConfig>).map(
    ([key, value]) => [key, createPresetConfigRecord(value)],
  ),
);

/**
 * Sets how the app is configured by default
 */
export const defaultConfig =
  presetConfigRecord[Object.keys(presetConfigRecord)[0]];
