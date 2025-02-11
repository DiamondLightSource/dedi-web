import { create } from "zustand";
import { WavelengthUnits, ReciprocalWavelengthUnits } from "../utils/units";
import * as mathjs from "mathjs";
import { convertFromDtoQ, convertFromSToQ } from "./scatteringQuantities";

export enum ScatteringOptions {
  q = "q",
  s = "s",
  d = "d",
}

export interface ResultStore {
  requested: ScatteringOptions;
  qUnits: ReciprocalWavelengthUnits;
  sUnits: ReciprocalWavelengthUnits;
  dUnits: WavelengthUnits;
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
  updateSUnits: (newunits: ReciprocalWavelengthUnits) => void;
  updateDUnits: (newunits: WavelengthUnits) => void;
  getUnit: (value: number) => mathjs.Unit;
}

/**
 * Zustand store for the results
 */
export const useResultStore = create<ResultStore>((set, get) => ({
  requested: ScatteringOptions.q,
  qUnits: ReciprocalWavelengthUnits.nanometres,
  sUnits: ReciprocalWavelengthUnits.nanometres,
  dUnits: WavelengthUnits.nanometres,
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
    set({ qUnits: newunits }),
  updateSUnits: (newunits: ReciprocalWavelengthUnits) =>
    set({ sUnits: newunits }),
  updateDUnits: (newunits: WavelengthUnits) => set({ dUnits: newunits }),
  getUnit: (value: number) => {
    const state = get();
    if (state.requested === ScatteringOptions.d) {
      return convertFromDtoQ(mathjs.unit(value, state.dUnits));
    }
    if (state.requested === ScatteringOptions.s) {
      return convertFromSToQ(mathjs.unit(value, state.sUnits));
    }
    return mathjs.unit(value, state.qUnits);
  },
}));
