import { AppDetector } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { detectorRecord, defaultConfig } from "../presets/presetManager";

export interface DetectorStore {
  detector: AppDetector;
  name: string;
  detectorRecord: Record<string, AppDetector>;
  /** Switch to a different detector from the record by name. */
  updateDetector: (newDetector: string) => void;
  /** Convert the pixel size units without changing the physical value. */
  updatePixelUnits: (newUnits: LengthUnits) => void;
  /** Add a custom detector to the record at runtime. */
  addNewDetector: (name: string, detector: AppDetector) => void;
}

/**
 * Zustand store for the currently selected detector.
 * The detectorRecord is pre-populated from detectors.json and can be
 * extended at runtime via the detector dialog.
 */
export const useDetectorStore = create<DetectorStore>((set) => ({
  name: defaultConfig.detector,
  detector: detectorRecord[defaultConfig.detector],
  detectorRecord,
  updateDetector: (newDetector: string) =>
    set((state) => ({
      detector: state.detectorRecord[newDetector],
      name: newDetector,
    })),
  updatePixelUnits: (newUnits: LengthUnits) =>
    set((state) => ({
      detector: {
        ...state.detector,
        pixelSize: {
          height: state.detector.pixelSize.height.to(newUnits),
          width: state.detector.pixelSize.width.to(newUnits),
        },
      },
    })),
  addNewDetector: (name: string, detector: AppDetector) =>
    set((state) => ({
      detectorRecord: { ...state.detectorRecord, [name]: detector },
    })),
}));
