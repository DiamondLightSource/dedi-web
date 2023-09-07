import { create } from "zustand";

export enum PlotAxes {
  milimeter = "milimeter",
  pixel = "pixel",
  reciprocal = "reciprocal",
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
  edit: (newConfig: Partial<PlotConfig>) => void;
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
  edit: (newConfig) => {
    set({ ...newConfig });
  },
}));
