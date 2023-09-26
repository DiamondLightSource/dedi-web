import { create } from "zustand";
import { AngleUnits, DistanceUnits, WavelengthUnits } from "../utils/units";

export enum PlotAxes {
  milimeter = "milimeter",
  pixel = "pixel",
  reciprocal = "reciprocal",
}

export interface ScatteringQuantity {
  name: string;
  minValue: number;
  maxValue: number;
  RequestedMin: number;
  RequestedMax: number;
  units: DistanceUnits | WavelengthUnits | AngleUnits;
  generate: (qvalue: number) => number;
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
  update: (newConfig) => {
    set({ ...newConfig });
  },
}));

