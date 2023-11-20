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
  beamstopColor: RGBColor;
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
  detectorColour: { r: 144, g: 19, b: 254, a: 0.4 },
  beamstop: true,
  beamstopColor: { r: 0, g: 0, b: 0, a: 1 },
  cameraTube: true,
  cameraTubeColor: { r: 80, g: 227, b: 194, a: 0.4 },
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
