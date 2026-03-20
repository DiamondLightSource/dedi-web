import { AppBeamstop, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";
import { unit } from "mathjs";

export interface BeamstopStore {
  beamstop: AppBeamstop;
  /** Partially update the beam centre position (pixels). */
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  /** Set the beamstop diameter with a new value and unit. */
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) => void;
  /** Convert the current diameter to a different unit without changing its value. */
  updateDiameterUnits: (newUnits: LengthUnits) => void;
  /** Set the beamstop clearance in pixels. */
  updateClearance: (newClearance: number | null) => void;
  /** Replace the entire beamstop (e.g. when loading a preset). */
  setBeamstop: (beamstop: AppBeamstop) => void;
}

/**
 * Zustand store for the beamstop.
 * Holds the current beamstop configuration and exposes granular update actions
 * so React components can update individual fields without re-creating the object.
 */
export const useBeamstopStore = create<BeamstopStore>((set) => ({
  beamstop: defaultConfig.beamstop,

  updateCentre: (newCentre) =>
    set((state) => ({
      beamstop: {
        ...state.beamstop,
        centre: { ...state.beamstop.centre, ...newCentre },
      },
    })),

  updateDiameter: (newDiameter, newUnits) =>
    set((state) => ({
      beamstop: {
        ...state.beamstop,
        diameter: unit(newDiameter, newUnits),
      },
    })),

  updateDiameterUnits: (newUnits) =>
    set((state) => ({
      beamstop: {
        ...state.beamstop,
        diameter: state.beamstop.diameter.to(newUnits),
      },
    })),

  updateClearance: (newClearance) =>
    set((state) => ({
      beamstop: {
        ...state.beamstop,
        clearance: newClearance,
      },
    })),

  setBeamstop: (beamstop) => set({ beamstop }),
}));
