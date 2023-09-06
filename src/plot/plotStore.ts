import { create } from "zustand";

export enum PlotAxes {
    milimeter = "milimeter",
    pixel = "pixel",
    reciprocal = "reciprocal",
}

interface PlotItem {
    inPlot: boolean;
    colour: string;
}

export interface PlotConfig {
    detector: PlotItem;
    beamstop: PlotItem;
    cameraTube: PlotItem;
    clearnace: PlotItem;
    qrange: boolean;
    mask: boolean;
    calibrantInPlot: boolean;
    calibrant: string;
    plotAxes: PlotAxes;
    edit: (newConfig: Partial<PlotConfig>) => void;
}

export const usePlotStore = create<PlotConfig>((set) => ({
    detector: { inPlot: true, colour: "red" },
    beamstop: { inPlot: true, colour: "blue" },
    cameraTube: { inPlot: true, colour: "green" },
    clearnace: { inPlot: true, colour: "pink" },
    qrange: true,
    mask: false,
    calibrantInPlot: false,
    calibrant: "something",
    plotAxes: PlotAxes.milimeter,
    edit: (newConfig) => { set({ ...newConfig }) }
}));
