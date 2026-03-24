import { AppBeamline, IOBeamline } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { defaultConfig, presetConfigRecord } from "../presets/presetManager";
import { Unit, unit } from "mathjs";
import { wavelength2EnergyConverter } from "../utils/units";

export interface BeamlineConfigStore {
  beamline: AppBeamline;
  /** Derived energy value kept in sync with wavelength, for display. */
  energy: Unit;
  /** Raw user-entered energy number (before unit wrapping), for controlled inputs. */
  userEnergy: number | null;
  /** Raw user-entered wavelength number, for controlled inputs. */
  userWavelength: number | null;
  /** Raw user-entered angle number, for controlled inputs. */
  userAngle: number | null;
  /** The name of the currently loaded beamline preset. */
  currentPresetName: string;
  /** Record which preset is currently active. */
  setCurrentPresetName: (name: string) => void;
  /** All available beamline presets loaded from JSON. */
  presetRecord: Record<string, IOBeamline>;
  /** Add a new beamline preset at runtime (e.g. from the config dialog). */
  addNewPreset: (name: string, newPreset: IOBeamline) => void;
  /** Set a new energy value; does not update wavelength — caller must keep in sync. */
  updateEnergy: (newEnergy: number | null, newUnits: EnergyUnits) => void;
  /** Convert the stored energy to a different unit. */
  updateEnergyUnits: (newUnits: EnergyUnits) => void;
  /** Set the wavelength to a new value in the given units. */
  updateWavelength: (
    newWavelength: number | null,
    newUnits: WavelengthUnits,
  ) => void;
  /** Convert the stored wavelength (and wavelength limits) to a different unit. */
  updateWavelengthUnits: (newUnits: WavelengthUnits) => void;
  /** Set the scatter angle to a new value in the given units. */
  updateAngle: (newAngle: number | null, newUnits: AngleUnits) => void;
  /** Convert the stored angle to a different unit. */
  updateAngleUnits: (newUnits: AngleUnits) => void;
  /** Set the camera length (metres). */
  updateCameraLength: (newLength: number | null) => void;
  /** Replace the entire beamline (e.g. when loading a preset). */
  updateBeamline: (beamline: AppBeamline) => void;
}

/**
 * Zustand store for beamline configuration.
 *
 * Holds the current beamline settings (wavelength, angle, camera length)
 * plus the full preset record. The `userX` fields mirror the raw numeric
 * inputs so that controlled form fields can display them without
 * rounding artefacts from mathjs unit conversions.
 */
export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
  beamline: defaultConfig.beamline,
  presetRecord: presetConfigRecord,
  currentPresetName: Object.keys(presetConfigRecord)[0],
  setCurrentPresetName: (name) => set({ currentPresetName: name }),

  energy: wavelength2EnergyConverter(defaultConfig.beamline.wavelength).to(
    EnergyUnits.kiloElectronVolts,
  ),
  userEnergy: wavelength2EnergyConverter(defaultConfig.beamline.wavelength)
    .to(EnergyUnits.kiloElectronVolts)
    .toNumber(),
  userWavelength: defaultConfig.beamline.wavelength.toNumber(),
  userAngle: defaultConfig.beamline.angle.toNumber(),

  updateAngle: (newAngle: number | null, newUnits: AngleUnits) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        angle: unit(newAngle ?? NaN, newUnits),
      },
      userAngle: newAngle,
    })),

  updateAngleUnits: (newUnits: AngleUnits) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        angle: state.beamline.angle.to(newUnits),
      },
      userAngle: state.beamline.angle.to(newUnits).toNumber(),
    })),

  updateCameraLength: (newLength: number | null) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        cameraLength: newLength,
      },
    })),

  updateWavelength: (newWavelength: number | null, newUnits: WavelengthUnits) =>
    set((state) => ({
      beamline: {
        ...state.beamline,
        wavelength: unit(newWavelength ?? NaN, newUnits),
      },
      userWavelength: newWavelength,
    })),

  updateWavelengthUnits: (newUnits: WavelengthUnits) =>
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

  updateBeamline: (beamline: AppBeamline) => set({ beamline }),

  addNewPreset: (name: string, newPreset: IOBeamline) =>
    set((state) => ({
      presetRecord: { ...state.presetRecord, [name]: newPreset },
    })),
}));
