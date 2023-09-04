import { Detector } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";
import { detectorList } from "../presets/presetManager";

export interface DetectorStore {
  name: string;
  current: Detector;
  pixelUnits: DistanceUnits;
  detectorList: Record<string, Detector>;
  updateDetector: (newDetector: string) => void;
  updateUnits: (newUnits: DistanceUnits) => void;
}

export const useDetectorStore = create<DetectorStore>((set) => ({
  name: "test",
  current: detectorList.test,
  pixelUnits: DistanceUnits.millimetre,
  detectorList: detectorList,
  updateDetector: (newDetector: string) =>
    set((state) => ({
      current: state.detectorList[newDetector],
      name: newDetector,
    })),
  updateUnits: (newUnits: DistanceUnits) => set({ pixelUnits: newUnits }),
}));
