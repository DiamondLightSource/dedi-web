import { RGBColor } from "react-color";
import { create } from "zustand";
import { Calibrant } from "../utils/types";
import { calibrantRecord } from "../presets/presetManager";
import {
  loadUserCalibrants,
  saveUserCalibrants,
  deleteUserCalibrant,
} from "../utils/persistedStorage";

const persistedUserCalibrants = loadUserCalibrants();
const initialCalibrantRecord: Record<string, Calibrant> = {
  ...calibrantRecord,
  ...persistedUserCalibrants,
};

export enum PlotAxes {
  millimetre = "mm",
  pixel = "pixel",
  reciprocal = "nm^-1",
}

// default colours used in app
const lilac: RGBColor = { r: 144, g: 19, b: 254, a: 0.4 };
const black: RGBColor = { r: 0, g: 0, b: 0, a: 1 };
const blackOpaque: RGBColor = { r: 0, g: 0, b: 0, a: 0.2 };
const turquoise: RGBColor = { r: 80, g: 227, b: 194, a: 0.4 };
const mustard: RGBColor = { r: 245, g: 166, b: 35, a: 1 };
const green: RGBColor = { r: 65, g: 117, b: 5, a: 1 };
const red: RGBColor = { r: 208, g: 2, b: 27, a: 1 };

export interface PlotConfig {
  detector: boolean;
  detectorColor: RGBColor;
  calibrant: boolean;
  calibrantColor: RGBColor;
  mask: boolean;
  maskColor: RGBColor;
  beamstop: boolean;
  beamstopColor: RGBColor;
  cameraTube: boolean;
  cameraTubeColor: RGBColor;
  visibleRange: boolean;
  visibleColor: RGBColor;
  requestedRange: boolean;
  requestedRangeColor: RGBColor;
  inaccessibleRange: boolean;
  inaccessibleRangeColor: RGBColor;
  clearance: boolean;
  clearanceColor: RGBColor;
  plotAxes: PlotAxes;
  currentCalibrant: string;
  calibrantRecord: Record<string, Calibrant>;
  /** Only the user-added calibrants, persisted to localStorage. */
  userCalibrantRecord: Record<string, Calibrant>;
  update: (newConfig: Partial<PlotConfig>) => void;
  /** Add a custom calibrant to the record at runtime and persist it. */
  addCalibrant: (name: string, calibrant: Calibrant) => void;
  /** Delete a user-added calibrant by name. Built-in calibrants cannot be deleted. */
  deleteCalibrant: (name: string) => void;
}

export const usePlotStore = create<PlotConfig>((set) => ({
  detector: true,
  detectorColor: lilac,
  calibrant: false,
  calibrantColor: blackOpaque,
  mask: true,
  maskColor: black,
  beamstop: true,
  beamstopColor: black,
  cameraTube: true,
  cameraTubeColor: turquoise,
  visibleRange: true,
  visibleColor: mustard,
  requestedRange: true,
  requestedRangeColor: green,
  clearance: true,
  clearanceColor: blackOpaque,
  inaccessibleRange: true,
  inaccessibleRangeColor: red,
  plotAxes: PlotAxes.millimetre,
  currentCalibrant: Object.keys(initialCalibrantRecord)[0],
  calibrantRecord: initialCalibrantRecord,
  userCalibrantRecord: persistedUserCalibrants,
  update: (newConfig) => {
    set({ ...newConfig });
  },
  addCalibrant: (name, calibrant) =>
    set((state) => {
      const updatedUserRecord = {
        ...state.userCalibrantRecord,
        [name]: calibrant,
      };
      saveUserCalibrants(updatedUserRecord);
      return {
        calibrantRecord: { ...state.calibrantRecord, [name]: calibrant },
        userCalibrantRecord: updatedUserRecord,
        currentCalibrant: name,
      };
    }),
  deleteCalibrant: (name: string) =>
    set((state) => {
      if (!(name in state.userCalibrantRecord)) return state;
      const updatedUserRecord = deleteUserCalibrant(
        name,
        state.userCalibrantRecord,
      );
      const updatedCalibrantRecord = Object.fromEntries(
        Object.entries(state.calibrantRecord).filter(([k]) => k !== name),
      );
      const fallbackName =
        state.currentCalibrant === name
          ? Object.keys(updatedCalibrantRecord)[0]
          : state.currentCalibrant;
      return {
        calibrantRecord: updatedCalibrantRecord,
        userCalibrantRecord: updatedUserRecord,
        currentCalibrant: fallbackName,
      };
    }),
}));
