import { Beamstop, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";
import { presetList } from "../presets/presetManager";

export interface BeamstopStore extends Beamstop {
  diameterUnits: DistanceUnits;
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateUnits: (newUnits: DistanceUnits) => void;
  updateClearance: (newClearnace: number | null) => void;
  updateBeamstop: (presetBeamstop: Beamstop) => void;
}

export const useBeamstopStore = create<BeamstopStore>((set) => ({
  ...presetList.test.beamstop,
  clearance: presetList.test.beamstop.clearance,
  diameterUnits: DistanceUnits.millimetre,
  updateCentre: (newCentre: Partial<SimpleVector2>) =>
    set((state) => ({ centre: { ...state.centre, ...newCentre } })),
  updateUnits: (newUnits: DistanceUnits) => set({ diameterUnits: newUnits }),
  updateClearance: (newClearnace: number | null) =>
    set({ clearance: newClearnace }),
  updateBeamstop: (presetBeamstop: Beamstop) => set(presetBeamstop),
}));
