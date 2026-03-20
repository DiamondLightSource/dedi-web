import { AppCircularDevice, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";
import { unit } from "mathjs";

export interface CameraTubeStore {
  cameraTube?: AppCircularDevice;
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateDiameterUnits: (newUnits: LengthUnits) => void;
  updateCameraTube: (presetCameraTube?: AppCircularDevice) => void;
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) => void;
  /** Remove the camera tube from the calculation. */
  removeCameraTube: () => void;
  /** Restore the camera tube to the default preset values. */
  restoreCameraTube: () => void;
}

/**
 * Zustand store for the camera tube.
 */
export const useCameraTubeStore = create<CameraTubeStore>((set, get) => ({
  cameraTube: defaultConfig.cameraTube,
  updateCentre: (newCentre: Partial<SimpleVector2>) => {
    const cameraTube = get().cameraTube;
    if (!cameraTube) {
      return;
    }
    set(() => ({
      cameraTube: {
        ...cameraTube,
        centre: { ...cameraTube.centre, ...newCentre },
      },
    }));
  },
  updateDiameterUnits: (newUnits: LengthUnits) => {
    const cameraTube = get().cameraTube;
    if (!cameraTube) {
      return;
    }
    set(() => ({
      cameraTube: {
        ...cameraTube,
        diameter: cameraTube.diameter.to(newUnits as string),
      },
    }));
  },
  updateCameraTube: (presetCameraTube?: AppCircularDevice) =>
    set({ cameraTube: presetCameraTube }),
  removeCameraTube: () => set({ cameraTube: undefined }),
  restoreCameraTube: () => set({ cameraTube: defaultConfig.cameraTube }),
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) => {
    const cameraTube = get().cameraTube;
    if (!cameraTube) {
      return;
    }
    set(() => ({
      cameraTube: {
        ...cameraTube,
        diameter: unit(newDiameter, newUnits as string),
      },
    }));
  },
}));
