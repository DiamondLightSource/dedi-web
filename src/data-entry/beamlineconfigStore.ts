import { AppBeamline } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";
import { Unit, unit } from "mathjs";
import { wavelength2EnergyConverter } from "../utils/units";

export interface BeamlineConfigStore {
  beamline: AppBeamline;
  // Energy for the benefit of the user.
  energy: Unit;
  userEnergy: number | null;
  userWavelength: number | null;
  userAngle: number | null;

  updateEnergy: (newEnergy: number | null, newUnits: EnergyUnits) => void;
  updateEnergyUnits: (newUnits: EnergyUnits) => void;
  updateWavelength: (
    newWavelength: number | null,
    newUnits: WavelengthUnits,
  ) => void;
  updateWavelengthUnits: (newUnits: WavelengthUnits) => void;
  updateAngle: (newAngle: number | null, newUnits: AngleUnits) => void;
  updateAngleUnits: (newUnits: AngleUnits) => void;
  updateCameraLength: (newLength: number | null) => void;
  updateBeamline: (beamline: AppBeamline) => void;
  update: (newConfig: Partial<BeamlineConfigStore>) => void;
}

/**
 * Zustand store for information relating to the beamline
 */
export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  beamline: defaultConfig.beamline,
  beamlineName: defaultConfig.beamline,

  energy: wavelength2EnergyConverter(defaultConfig.beamline.wavelength).to(
    EnergyUnits.kiloElectronVolts,
  ),
  userEnergy: wavelength2EnergyConverter(defaultConfig.beamline.wavelength)
    .to(EnergyUnits.kiloElectronVolts)
    .toNumber(),

  userWavelength: defaultConfig.beamline.wavelength.toNumber(),

  userAngle: defaultConfig.beamline.angle.toNumber(),

  updateAngle: (newAngle: number | null, newUnits: string) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        angle: unit(newAngle ?? NaN, newUnits),
      },
      userAngle: newAngle,
    })),

  updateAngleUnits: (newUnits: AngleUnits) => {
    set((state) => ({
      beamline: {
        ...state.beamline,
        angle: state.beamline.angle.to(newUnits),
      },
      userAngle: state.beamline.angle.to(newUnits).toNumber(),
    }));
  },

  updateCameraLength: (newLength: number | null) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        cameraLength: newLength,
      },
    })),

  updateWavelength: (
    newWavelength: number | null,
    newUnits: WavelengthUnits,
  ) => {
    set((state) => ({
      beamline: {
        ...state.beamline,
        wavelength: unit(newWavelength ?? NaN, newUnits),
        wavelengthLimits: {
          min: state.beamline.wavelengthLimits.min.to(newUnits),
          max: state.beamline.wavelengthLimits.max.to(newUnits),
        },
      },
      userWavelength: newWavelength,
    }));
  },

  updateWavelengthUnits: (newUnits: WavelengthUnits) => {
    set((state) => ({
      beamline: {
        ...state.beamline,
        wavelength: state.beamline.wavelength.to(newUnits),
        wavelengthLimits: {
          min: state.beamline.wavelengthLimits.min.to(newUnits),
          max: state.beamline.wavelengthLimits.max.to(newUnits),
        },
      },
      userWavelength: state.beamline.wavelength.to(newUnits).toNumber(),
    }));
  },

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

  update: (newConfig: Partial<BeamlineConfigStore>) => set({ ...newConfig }),
  updateBeamline: (beamline: AppBeamline) =>
    set({
      beamline: beamline,
    }),
}));
