import { AppBeamline } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { beamlineRecord, defaultConfig } from "../presets/presetManager";
import { Unit, unit } from "mathjs";
import { wavelength2EnergyConverter } from "../utils/units";

export interface BeamlineConfigStore {
  beamlineName: string;
  beamline: AppBeamline;
  beamlineRecord: Record<string, AppBeamline>;

  energy: Unit;
  userEnergy: number | null;

  wavelength: Unit;
  userWavelength: number | null;

  angle: Unit;
  userAngle: number | null;

  cameraLength: number | null;

  updateBeamline: (newBeamline: string) => void;
  addNewBeamline: (name: string, beamline: AppBeamline) => void;

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
  update: (newConfig: Partial<BeamlineConfigStore>) => void;
}

/**
 * Zustand store for information relating to the beamline
 */
export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  beamline: beamlineRecord[defaultConfig.beamline],
  beamlineName: defaultConfig.beamline,
  beamlineRecord: beamlineRecord,

  energy: wavelength2EnergyConverter(defaultConfig.wavelength).to(
    EnergyUnits.kiloElectronVolts,
  ),
  userEnergy: wavelength2EnergyConverter(defaultConfig.wavelength)
    .to(EnergyUnits.kiloElectronVolts)
    .toNumber(),

  wavelength: defaultConfig.wavelength,
  userWavelength: defaultConfig.wavelength.toNumber(),

  angle: defaultConfig.angle,
  userAngle: defaultConfig.angle.toNumber(),

  cameraLength: defaultConfig.cameraLength,

  updateBeamline: (newBeamline: string) =>
    set((state: BeamlineConfigStore) => ({
      beamline: state.beamlineRecord[newBeamline],
      beamlineName: newBeamline,
    })),

  addNewBeamline: (name: string, beamline: AppBeamline) => {
    {
      set((state: BeamlineConfigStore) => ({
        beamlineRecord: { ...state.beamlineRecord, [name]: beamline },
      }));
    }
  },

  updateAngle: (newAngle: number | null, newUnits: string) =>
    set({
      angle: unit(newAngle ?? NaN, newUnits),
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
      beamline: {
        ...state.beamline,
        minWavelength: state.beamline.minWavelength.to(newUnits),
        maxWavelength: state.beamline.maxWavelength.to(newUnits),
      },
    })),

  updateWavelengthUnits: (newUnits: WavelengthUnits) =>
    set((state) => ({
      wavelength: state.wavelength.to(newUnits),
      userWavelength: state.wavelength.to(newUnits).toNumber(),
      beamline: {
        ...state.beamline,
        minWavelength: state.beamline.minWavelength.to(newUnits),
        maxWavelength: state.beamline.maxWavelength.to(newUnits),
      },
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

  update: (newConfig: Partial<BeamlineConfigStore>) => set({ ...newConfig }),
}));
