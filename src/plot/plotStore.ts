import { create } from "zustand";
import NumericRange from "../calculations/numericRange";

export enum PlotAxes {
  milimeter = "milimeter",
  pixel = "pixel",
  reciprocal = "reciprocal",
}
export enum ScatteringOptions {
  q = "q",
  s = "s",
  d = "d",
  twoTheta = `2${'\u03B8'}`
}

export interface PlotConfig {
  detector: boolean;
  beamstop: boolean;
  cameraTube: boolean;
  clearnace: boolean;
  qrange: boolean;
  mask: boolean;
  calibrantInPlot: boolean;
  calibrant: string;
  plotAxes: PlotAxes;
  requestedRange: NumericRange;
  selected: ScatteringOptions;
  units: string;
  update: (newConfig: Partial<PlotConfig>) => void;
}

export const usePlotStore = create<PlotConfig>((set) => ({
  detector: true,
  beamstop: true,
  cameraTube: true,
  clearnace: true,
  qrange: true,
  mask: false,
  calibrantInPlot: false,
  calibrant: "something",
  plotAxes: PlotAxes.milimeter,
  requestedRange: new NumericRange(0, 1),
  selected: ScatteringOptions.q,
  units: "r-nanometres",
  update: (newConfig) => {
    set({ ...newConfig });
  },
}));
