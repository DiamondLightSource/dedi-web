import { create } from "zustand";
import { AngleUnits, WavelengthUnits } from "../utils/units";

interface ScatteringQuantity {
    name: string,
    minValue: number,
    maxValue: number,
    RequestedMin: number,
    RequestedMax: number,
}

export interface ResultStore {
    selected: string,
    q: ScatteringQuantity,
    qUnits: WavelengthUnits,
    twoTheta: ScatteringQuantity
    thetaUnits: AngleUnits
}


