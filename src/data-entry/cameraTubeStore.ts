import { CircularDevice, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";

export interface CameraTubeStore extends CircularDevice {
  diameterUnits: DistanceUnits;
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateUnits: (newUnits: DistanceUnits) => void;
  updateCameraTube: (presetCameraTube: CircularDevice) => void;
}

export const useCameraTubeStore = create<CameraTubeStore>((set) => ({
  centre: {
    x: defaultConfig.cameraTube.centre.x,
    y: defaultConfig.cameraTube.centre.y,
  },
  diameter: defaultConfig.cameraTube.diameter,
  diameterUnits: DistanceUnits.millimetre,
  updateCentre: (newCentre: Partial<SimpleVector2>) =>
    set((state) => ({ centre: { ...state.centre, ...newCentre } })),
  updateUnits: (newUnits: DistanceUnits) => set({ diameterUnits: newUnits }),
  updateCameraTube: (presetCameraTube: CircularDevice) => set(presetCameraTube),
}));
