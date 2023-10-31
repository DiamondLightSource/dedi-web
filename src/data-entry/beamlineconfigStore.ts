import { BeamlineConfig } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { presetList, defaultConfig } from "../presets/presetManager";

export interface BeamlineConfigStore extends BeamlineConfig {
  preset: string | null;
  beamEnergyUnits: EnergyUnits;
  energy: number | null;
  angleUnits: AngleUnits;
  wavelengthUnits: WavelengthUnits;
  update: (storeConfig: Partial<BeamlineConfigStore>) => void;
}

export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  preset: Object.keys(presetList)[0],
  angle: defaultConfig.angle,
  cameraLength: defaultConfig.cameraLength,
  minWavelength: defaultConfig.minWavelength,
  maxWavelength: defaultConfig.maxWavelength,
  minCameraLength: defaultConfig.minCameraLength,
  maxCameraLength: defaultConfig.maxCameraLength,
  energy: null,
  wavelength: null,
  beamEnergyUnits: EnergyUnits.kiloElectronVolts,
  angleUnits: AngleUnits.radians,
  wavelengthUnits: WavelengthUnits.nanmometres,
  update: (storeConfig: Partial<BeamlineConfigStore>) =>
    set({ ...storeConfig }),
}));
