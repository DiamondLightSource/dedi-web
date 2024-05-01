import { AppBeamstop, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";
import { unit } from "mathjs";

export interface BeamstopStore extends AppBeamstop {
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) => void;
  updateDiameterUnits: (newUnits: LengthUnits) => void;
  updateClearance: (newClearnace: number | null) => void;
  updateBeamstop: (presetBeamstop: AppBeamstop) => void;
}

/**
 * Zustand store for the beamstop
 */
export const useBeamstopStore = create<BeamstopStore>((set) => ({
  ...defaultConfig.beamstop,
  updateCentre: (newCentre: Partial<SimpleVector2>) =>
    set((state) => ({ centre: { ...state.centre, ...newCentre } })),
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) =>
    set({ diameter: unit(newDiameter, newUnits) }),
  updateDiameterUnits: (newUnits: LengthUnits) =>
    set((state) => ({ diameter: state.diameter.to(newUnits) })),
  updateClearance: (newClearnace: number | null) =>
    set({ clearance: newClearnace }),
  updateBeamstop: (presetBeamstop: AppBeamstop) => set(presetBeamstop),
}));
