import { RGBColor } from "react-color";
import { create } from "zustand";

export enum PlotAxes {
  milimeter = "milimeter",
  pixel = "pixel",
  reciprocal = "reciprocal",
}

export interface PlotConfig {
  detector: boolean;
  detectorColour: RGBColor;
  beamstop: boolean;
  cameraTube: boolean;
  cameraTubeColor: RGBColor;
  clearnace: boolean;
  qrange: boolean;
  mask: boolean;
  calibrantInPlot: boolean;
  calibrant: string;
  plotAxes: PlotAxes;
  update: (newConfig: Partial<PlotConfig>) => void;
}

export const usePlotStore = create<PlotConfig>((set) => ({
  detector: true,
  detectorColour: { r: 1, g: 2, b: 1, a: 0.2 },
  beamstop: true,
  cameraTube: true,
  cameraTubeColor: { r: 1, g: 2, b: 1, a: 0.2 },
  clearnace: true,
  qrange: true,
  mask: false,
  calibrantInPlot: false,
  calibrant: "something",
  plotAxes: PlotAxes.milimeter,
  update: (newConfig) => {
    set({ ...newConfig });
  },
}));
