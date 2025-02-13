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
