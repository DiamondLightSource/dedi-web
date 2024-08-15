import { create } from "zustand";
import { WavelengthUnits, ReciprocalWavelengthUnits } from "../utils/units";

export const theta = "\u03B8";

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
}

/**
 * Zustand store for the results
 */
export const useResultStore = create<ResultStore>((set) => ({
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
}));
