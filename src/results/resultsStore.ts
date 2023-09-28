import { create } from "zustand";
import NumericRange from "../calculations/numericRange";

const theta = "\u03B8";

export enum ScatteringQuantity {
  q = "q",
  d = "d",
  s = "s",
  twoTheta = "2" + theta,
}

export interface ResultStore {
  selected: ScatteringQuantity;
  requestedRange: NumericRange;
  update: (results: Partial<ResultStore>) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  selected: ScatteringQuantity.q,
  requestedRange: new NumericRange(0, 1),
  update: (results: Partial<ResultStore>) => {
    set({ ...results });
  },
}));
