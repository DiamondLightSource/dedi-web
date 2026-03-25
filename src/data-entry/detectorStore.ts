import { AppDetector, IODetector } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import {
  detectorRecord,
  defaultConfig,
  createInternalDetector,
} from "../presets/presetManager";
import {
  loadUserDetectors,
  saveUserDetectors,
  deleteUserDetector,
} from "../utils/persistedStorage";

function appDetectorToIO(detector: AppDetector): IODetector {
  return {
    resolution: detector.resolution,
    pixelSize: {
      height: detector.pixelSize.height.toNumber(LengthUnits.millimetre),
      width: detector.pixelSize.width.toNumber(LengthUnits.millimetre),
    },
    ...(detector.mask ? { mask: detector.mask } : {}),
  };
}

const persistedUserDetectors = loadUserDetectors();
const initialDetectorRecord: Record<string, AppDetector> = {
  ...detectorRecord,
  ...Object.fromEntries(
    Object.entries(persistedUserDetectors).map(([key, value]) => [
      key,
      createInternalDetector(value),
    ]),
  ),
};

export interface DetectorStore {
  detector: AppDetector;
  name: string;
  detectorRecord: Record<string, AppDetector>;
  userDetectorRecord: Record<string, IODetector>;
  /** Switch to a different detector from the record by name. */
  updateDetector: (newDetector: string) => void;
  /** Convert the pixel size units without changing the physical value. */
  updatePixelUnits: (newUnits: LengthUnits) => void;
  /** Add a custom detector to the record at runtime and persist it. */
  addNewDetector: (name: string, detector: AppDetector) => void;
  /** Delete a user-added detector by name. Built-in detectors cannot be deleted. */
  deleteDetector: (name: string) => void;
}

/**
 * Zustand store for the currently selected detector.
 * The detectorRecord is pre-populated from detectors.json and any
 * user-added detectors from localStorage. It can be extended at runtime
 * via the detector dialog.
 */
export const useDetectorStore = create<DetectorStore>((set) => ({
  name: defaultConfig.detector,
  detector: initialDetectorRecord[defaultConfig.detector],
  detectorRecord: initialDetectorRecord,
  userDetectorRecord: persistedUserDetectors,
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
    set((state) => {
      const ioDetector = appDetectorToIO(detector);
      const updatedUserRecord = {
        ...state.userDetectorRecord,
        [name]: ioDetector,
      };
      saveUserDetectors(updatedUserRecord);
      return {
        detectorRecord: { ...state.detectorRecord, [name]: detector },
        userDetectorRecord: updatedUserRecord,
      };
    }),
  deleteDetector: (name: string) =>
    set((state) => {
      if (!(name in state.userDetectorRecord)) return state;
      const updatedUserRecord = deleteUserDetector(
        name,
        state.userDetectorRecord,
      );
      const updatedDetectorRecord = Object.fromEntries(
        Object.entries(state.detectorRecord).filter(([k]) => k !== name),
      );
      return {
        detectorRecord: updatedDetectorRecord,
        userDetectorRecord: updatedUserRecord,
        name: state.name === name ? Object.keys(updatedDetectorRecord)[0] : state.name,
        detector: state.name === name ? Object.values(updatedDetectorRecord)[0] : state.detector,
      };
    }),
}));
