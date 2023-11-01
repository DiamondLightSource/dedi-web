import { create } from "zustand";
import { WavelengthUnits, ReciprocalWavelengthUnits } from "../utils/units";
import { D, Q, S, ScatteringQuantity } from "./scatteringQuantities";

export const theta = "\u03B8";

export enum ScatteringOptions {
  q = "q",
  s = "s",
  d = "d",
}

export interface ResultStore {
  requested: ScatteringOptions;
  q: ScatteringQuantity;
  s: ScatteringQuantity;
  d: ScatteringQuantity;
  requestedMin: number | null;
  requestedMax: number | null;
  updateRequested: (quantity: ScatteringOptions) => void;
  updateRequestedRange: (
    newRange: Partial<{
      requestedMin: number | null;
      requestedMax: number | null;
    }>,
  ) => void;
  updateQUnits: (newunits: ReciprocalWavelengthUnits) => void;
  updateSUnits: (newunits: WavelengthUnits) => void;
  updateDUnits: (newunits: WavelengthUnits) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  requested: ScatteringOptions.q,
  q: new Q(ReciprocalWavelengthUnits.nanmometres),
  s: new S(WavelengthUnits.nanmometres),
  d: new D(WavelengthUnits.nanmometres),
  requestedMin: null,
  requestedMax: null,
  updateRequested: (quantity: ScatteringOptions) => {
    set({ requested: quantity });
  },
  updateRequestedRange: (
    newRange: Partial<{
      requestedMin: number | null;
      requestedMax: number | null;
    }>,
  ) => {
    set({ ...newRange });
  },
  updateQUnits: (newunits: ReciprocalWavelengthUnits) =>
    set({ q: new Q(newunits) }),
  updateSUnits: (newunits: WavelengthUnits) => set({ s: new S(newunits) }),
  updateDUnits: (newunits: WavelengthUnits) => set({ d: new D(newunits) }),
}));
