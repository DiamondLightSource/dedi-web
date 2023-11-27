import detectorDataRecord from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import {
  BeamlineConfig,
  Detector,
  CircularDevice,
  Beamstop,
  SimpleVector2,
} from "../utils/types";
import { unit } from "mathjs";

export interface AppDataFormat extends BeamlineConfig {
  detector: string;
  beamstop: Beamstop;
  cameraTube: CircularDevice;
}

interface DetectorData {
  resolution: { height: number; width: number };
  pixelSize: { height: number; width: number };
}

interface CircularDeviceData {
  centre: SimpleVector2,
  diameter: number,
}

export interface BeamlineData {
  readonly angle: number | null;
  readonly cameraLength: number | null;
  readonly minWavelength: number;
  readonly maxWavelength: number;
  readonly minCameraLength: number;
  readonly maxCameraLength: number;
  readonly wavelength: number | null;
  readonly cameraLengthStep: number;
}


interface BeamstopData extends CircularDeviceData {
  clearance: number | null;
}

export interface AppData extends BeamlineData {
  detector: string;
  beamstop: BeamstopData;
  cameraTube: CircularDeviceData;
}


export const detectorList: Record<string, Detector> = Object.fromEntries(
  Object.entries(detectorDataRecord as Record<string, DetectorData>).map(
    ([key, value]) => [
      key,
      {
        ...value,
        pixelSize: {
          height: unit(value.pixelSize.height, "mm"),
          width: unit(value.pixelSize.height, "mm"),
        },
      },
    ],
  ),
);

export const presetList: Record<string, AppDataFormat> = Object.fromEntries(Object.entries(presetData as Record<string, AppData>).map(
  ([key, value]) => [
    key, {
      ...value,
      beamstop: {
        ...value.beamstop,
        diameter: unit(value.beamstop.diameter, "mm"),
      },
      cameraTube: {
        ...value.cameraTube,
        diameter: unit(value.cameraTube.diameter, "mm"),
      },
      minWavelength: unit(value.minWavelength, "nm"),
      maxWavelength: unit(value.maxWavelength, "nm"),
      minCameraLength: unit(value.minCameraLength, "m"),
      maxCameraLength: unit(value.maxCameraLength, "m"),
      cameraLengthStep: unit(value.cameraLengthStep, "m"),

      cameraLength: unit(value.cameraLength ?? NaN, "mm"),
      wavelength: unit(value.wavelength ?? NaN, "mm"),
      angle: unit(value.angle ?? NaN, "mm"),
    }
  ]
));
export const defaultConfig = presetList[Object.keys(presetList)[0]];
