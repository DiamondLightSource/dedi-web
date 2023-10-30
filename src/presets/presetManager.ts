import detectorData from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import {
  BeamlineConfig,
  Detector,
  CircularDevice,
  Beamstop,
} from "../utils/types";

export interface AppDataFormat extends BeamlineConfig {
  detector: string;
  beamstop: Beamstop;
  cameraTube: CircularDevice;
}

export const detectorList = detectorData as Record<string, Detector>;
export const presetList = presetData as Record<string, AppDataFormat>;
export const defaultConfig = presetList[Object.keys(presetList)[0]];
