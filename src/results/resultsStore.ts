import { create } from "zustand";

const theta = "\u03B8";

export enum ScatteringQuantity {
  q = "q",
  d = "d",
  s = "s",
  twoTheta = "2" + theta,
}

export interface ResultStore {
  selected: ScatteringQuantity;
  requestedMinQ: number;
  requestedMaxQ: number;
  update: (results: Partial<ResultStore>) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  selected: ScatteringQuantity.q,
  requestedMinQ: 1,
  requestedMaxQ: 0,
  update: (results: Partial<ResultStore>) => {
    set({ ...results });
  },
}));
