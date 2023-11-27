import { BeamlineConfig } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { presetList, defaultConfig } from "../presets/presetManager";
import { unit, Unit } from "mathjs";

export interface BeamlineConfigStore extends BeamlineConfig {
  preset: string | null;
  energy: Unit;
  updateAngle: (newAngle: Unit) => void;
  updateAngleUnits: (newUnits: AngleUnits) => void;
  updateCameraLength: (newLength: number) => void;
  updateWavelength: (newWavelength: Unit) => void;
  updateWavelengthUnits: (newUnits: WavelengthUnits) => void;
  updateEnergy: (newEnergy: Unit) => void;
  updateEnergyUnits: (newUnits: EnergyUnits) => void;
  update: (newConfig: Partial<BeamlineConfig>) => void;
}

export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  preset: Object.keys(presetList)[0],
  ...defaultConfig,
  energy: unit(NaN, "keV"),
  updateAngle: (newAngle: Unit) => set({ angle: newAngle }),
  updateAngleUnits: (newUnits: AngleUnits) => set((state) => ({ angle: state.angle.to(newUnits) })),
  updateCameraLength: (newLength: number) => set({ cameraLength: unit(newLength, "m") }),
  updateWavelength: (newWavelength: Unit) => set((state) => (
    {
      wavelength: newWavelength,
      minWavelength: state.minWavelength.to(newWavelength.formatUnits()),
      maxWavelength: state.maxWavelength.to(newWavelength.formatUnits())
    })),
  updateWavelengthUnits: (newUnits: WavelengthUnits) => set((state) => ({
    wavelength: state.wavelength.to(newUnits),
    minWavelength: state.minWavelength.to(newUnits),
    maxWavelength: state.maxWavelength.to(newUnits)
  })),
  updateEnergy: (newEnergy: Unit) => set({ energy: newEnergy }),
  updateEnergyUnits: (newUnits: EnergyUnits) => set((state) => ({ energy: state.energy.to(newUnits) })),
  update: (newConfig: Partial<BeamlineConfig>) => set({ ...newConfig }),
}));
