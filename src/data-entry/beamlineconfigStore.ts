import { BeamlineConfig } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";

export interface BeamlineConfigStore extends BeamlineConfig {
  preset: string | null;
  beamEnergyUnits: EnergyUnits;
  angleUnits: AngleUnits;
  wavelengthUnits: WavelengthUnits;
  update: (storeConfig: Partial<BeamlineConfigStore>) => void;
}

export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  preset: null,
  angle: null,
  cameraLength: 1,
  minWavelength: 1,
  maxWavelength: 2,
  minCameraLength: 10,
  maxCameraLength: 100,
  energy: null,
  wavelength: null,
  beamEnergyUnits: EnergyUnits.kiloElectronVolts,
  angleUnits: AngleUnits.radians,
  wavelengthUnits: WavelengthUnits.nanmometres,
  update: (storeConfig: Partial<BeamlineConfigStore>) =>
    set({ ...storeConfig }),
}));
