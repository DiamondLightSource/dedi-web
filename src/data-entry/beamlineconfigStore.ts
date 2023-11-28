import { BeamlineConfig } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { presetList, defaultConfig } from "../presets/presetManager";
import { Unit, unit } from "mathjs";
import { wavelength2EnergyConverter } from "../utils/units";

export interface BeamlineConfigStore extends BeamlineConfig {
  preset: string | null;
  energy: Unit;
  userEnergy: number | null;
  userWavelength: number | null;
  userAngle: number | null;
  updateAngle: (newAngle: number | null, newUnits: AngleUnits) => void;
  updateAngleUnits: (newUnits: AngleUnits) => void;
  updateCameraLength: (newLength: number | null) => void;
  updateWavelength: (
    newWavelength: number | null,
    newUnits: WavelengthUnits,
  ) => void;
  updateWavelengthUnits: (newUnits: WavelengthUnits) => void;
  updateEnergy: (newEnergy: number | null, newUnits: EnergyUnits) => void;
  updateEnergyUnits: (newUnits: EnergyUnits) => void;
  update: (newConfig: Partial<BeamlineConfig>) => void;
}

export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  preset: Object.keys(presetList)[0],
  ...defaultConfig,
  userEnergy: wavelength2EnergyConverter(defaultConfig.wavelength)
    .to("keV")
    .toNumber(),
  userWavelength: defaultConfig.wavelength.toNumber(),
  userAngle: defaultConfig.wavelength.toNumber(),
  energy: wavelength2EnergyConverter(defaultConfig.wavelength).to("keV"),
  updateAngle: (newAngle: number | null, newUnits: string) =>
    set({
      angle: unit(newAngle ?? NaN, newUnits as string),
      userAngle: newAngle,
    }),
  updateAngleUnits: (newUnits: AngleUnits) =>
    set((state) => ({
      angle: state.angle.to(newUnits),
      userAngle: state.angle.to(newUnits).toNumber(),
    })),
  updateCameraLength: (newLength: number | null) =>
    set({ cameraLength: newLength }),
  updateWavelength: (newWavelength: number | null, newUnits: WavelengthUnits) =>
    set((state) => ({
      wavelength: unit(newWavelength ?? NaN, newUnits),
      userWavelength: newWavelength,
      minWavelength: state.minWavelength.to(newUnits),
      maxWavelength: state.maxWavelength.to(newUnits),
    })),
  updateWavelengthUnits: (newUnits: WavelengthUnits) =>
    set((state) => ({
      wavelength: state.wavelength.to(newUnits),
      userWavelength: state.wavelength.to(newUnits).toNumber(),
      minWavelength: state.minWavelength.to(newUnits),
      maxWavelength: state.maxWavelength.to(newUnits),
    })),
  updateEnergy: (newEnergy: number | null, newUnits: EnergyUnits) =>
    set({
      energy: unit(newEnergy ?? NaN, newUnits),
      userEnergy: newEnergy,
    }),
  updateEnergyUnits: (newUnits: EnergyUnits) =>
    set((state) => ({
      energy: state.energy.to(newUnits),
      userEnergy: state.energy.to(newUnits).toNumber(),
    })),
  update: (newConfig: Partial<BeamlineConfig>) => set({ ...newConfig }),
}));
