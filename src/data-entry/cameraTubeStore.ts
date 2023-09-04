import { CircularDevice, SerialisedVector2 } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";

export interface CameraTubeStore extends CircularDevice {
  diameterUnits: DistanceUnits;
  updateCentre: (centre: Partial<SerialisedVector2>) => void;
  updateUnits: (newUnits: DistanceUnits) => void;
}

export const useCameraTubeStore = create<CameraTubeStore>((set) => ({
  centre: {
    x: 1,
    y: 1,
  },
  diameter: 1,
  diameterUnits: DistanceUnits.millimetre,
  updateCentre: (newCentre: Partial<SerialisedVector2>) =>
    set((state) => ({ centre: { ...state.centre, ...newCentre } })),
  updateUnits: (newUnits: DistanceUnits) => set({ diameterUnits: newUnits }),
}));
