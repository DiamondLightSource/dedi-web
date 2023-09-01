import detectorData from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import { BeamlineConfig, Detector, CircularDevice } from "../utils/types";

interface AppDataFormat extends BeamlineConfig {
  detector: string;
  beamstop: CircularDevice;
  cameraTube: CircularDevice;
}

export const detectorList = detectorData as Record<string, Detector>;
export const presetList = presetData as unknown as Record<
  string,
  AppDataFormat
>;
