import detectorData from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import { BeamlineConfig, Detector } from "../utils/types";

export const detectorList = detectorData as Record<string, Detector>;
export const presetList = presetData as unknown as Record<
  string,
  BeamlineConfig
>;
