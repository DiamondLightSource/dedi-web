import { RGBColor } from "react-color";
import { create } from "zustand";

export enum PlotAxes {
  milimeter = "mm",
  pixel = "pixel",
  reciprocal = "nm^-1",
}

export interface PlotConfig {
  detector: boolean;
  detectorColor: RGBColor;
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
  update: (newConfig: Partial<PlotConfig>) => void;
}

export const usePlotStore = create<PlotConfig>((set) => ({
  detector: true,
  detectorColor: { r: 144, g: 19, b: 254, a: 0.4 },
  mask: false,
  maskColor: { r: 0, g: 0, b: 0, a: 1 },
  beamstop: true,
  beamstopColor: { r: 0, g: 0, b: 0, a: 1 },
  cameraTube: true,
  cameraTubeColor: { r: 80, g: 227, b: 194, a: 0.4 },
  visibleRange: true,
  visibleColor: { r: 245, g: 166, b: 35, a: 1 },
  requestedRange: true,
  requestedRangeColor: { r: 65, g: 117, b: 5, a: 1 },
  clearance: true,
  clearanceColor: { r: 0, g: 0, b: 0, a: 0.2 },
  inaccessibleRange: true,
  inaccessibleRangeColor: { r: 208, g: 2, b: 27, a: 1 },
  plotAxes: PlotAxes.milimeter,
  update: (newConfig) => {
    set({ ...newConfig });
  },
}));
