import { Detector } from "../utils/types";
import { create } from "zustand";
import { DistanceUnits } from "../utils/units";
import { detectorList, defaultConfig } from "../presets/presetManager";

export interface DetectorStore extends Detector {
  name: string;
  detectorList: Record<string, Detector>;
  updateDetector: (newDetector: string) => void;
  updatePixelUnits: (newUnits: DistanceUnits) => void;
  addNewDetector: (name: string, detector: Detector) => void;
}

/**
 * Zustand store for the current selected detector.
 */
export const useDetectorStore = create<DetectorStore>((set) => ({
  name: defaultConfig.detector,
  ...detectorList[defaultConfig.detector],
  detectorList: detectorList,
  updateDetector: (newDetector: string) =>
    set((state: DetectorStore) => ({
      ...state.detectorList[newDetector],
      name: newDetector,
    })),
  updatePixelUnits: (newUnits: DistanceUnits) =>
    set((state: DetectorStore) => ({
      pixelSize: {
        height: state.pixelSize.height.to(newUnits as string),
        width: state.pixelSize.width.to(newUnits as string),
      },
    })),
  addNewDetector: (name: string, detector: Detector) => 
  { (state: DetectorStore) =>{
    state.detectorList[name] = detector;
  }
  },
}));
