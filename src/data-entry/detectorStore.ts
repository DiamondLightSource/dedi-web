import { AppDetector } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { detectorRecord, defaultConfig } from "../presets/presetManager";

export interface DetectorStore extends AppDetector {
  name: string;
  detectorRecord: Record<string, AppDetector>;
  updateDetector: (newDetector: string) => void;
  updatePixelUnits: (newUnits: LengthUnits) => void;
  addNewDetector: (name: string, detector: AppDetector) => void;
}

/**
 * Zustand store for the current selected detector.
 */
export const useDetectorStore = create<DetectorStore>((set) => ({
  name: defaultConfig.detector,
  ...detectorRecord[defaultConfig.detector],
  detectorRecord: detectorRecord,
  updateDetector: (newDetector: string) =>
    set((state: DetectorStore) => ({
      ...state.detectorRecord[newDetector],
      name: newDetector,
    })),
  updatePixelUnits: (newUnits: LengthUnits) =>
    set((state: DetectorStore) => ({
      pixelSize: {
        height: state.pixelSize.height.to(newUnits as string),
        width: state.pixelSize.width.to(newUnits as string),
      },
    })),
    addNewDetector: (name: string, detector: AppDetector) => 
      { (state: DetectorStore) =>{
        state.detectorRecord[name] = detector;
      }
      },
}));
