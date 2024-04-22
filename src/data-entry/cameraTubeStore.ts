import { CircularDevice, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";

export interface CameraTubeStore extends CircularDevice {
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateDiameterUnits: (newUnits: DistanceUnits) => void;
  updateCameraTube: (presetCameraTube: CircularDevice) => void;
}

/**
 * Zustand store with camera tube information
 */
export const useCameraTubeStore = create<CameraTubeStore>((set) => ({
  ...defaultConfig.cameraTube,
  updateCentre: (newCentre: Partial<SimpleVector2>) =>
    set((state) => ({ centre: { ...state.centre, ...newCentre } })),
  updateDiameterUnits: (newUnits: DistanceUnits) =>
    set((state) => ({ diameter: state.diameter.to(newUnits) })),
  updateCameraTube: (presetCameraTube: CircularDevice) => set(presetCameraTube),
}));
