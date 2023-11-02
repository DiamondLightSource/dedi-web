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
  sUnits: WavelengthUnits;
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
  updateSUnits: (newunits: WavelengthUnits) => void;
  updateDUnits: (newunits: WavelengthUnits) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  requested: ScatteringOptions.q,
  qUnits: ReciprocalWavelengthUnits.nanmometres,
  sUnits: WavelengthUnits.nanmometres,
  dUnits: WavelengthUnits.nanmometres,
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
  updateSUnits: (newunits: WavelengthUnits) => set({ sUnits: newunits }),
  updateDUnits: (newunits: WavelengthUnits) => set({ dUnits: newunits }),
}));
