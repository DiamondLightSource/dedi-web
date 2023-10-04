import { create } from "zustand";
import NumericRange from "../calculations/numericRange";
import { AngleUnits, WavelengthUnits, ReciprocalWavelengthUnits } from "../utils/units";
import { Q, ReciprocalWavelengthUnitsOptions } from "./scatteringQuantities";

export interface ScatteringQuantity {
    units: WavelengthUnits | AngleUnits | ReciprocalWavelengthUnits,
    unitOptions: { value: string, label: string }[],
    fromQ: (quantity: number) => number,
    tooQ: (quantity: number) => number,
};

export interface ResultStore {
    quantity: ScatteringQuantity;
    units: String;
    requestedRange: NumericRange;
    update: (newConfig: Partial<ResultStore>) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
    requestedRange: new NumericRange(0, 1),
    quantity: new Q("r-nanometres", ReciprocalWavelengthUnitsOptions);
    units: "r-nanometres",
    update: (newConfig) => {
        set({ ...newConfig });
    },
}));

