import { AppBeamstop, SimpleVector2 } from "../utils/types";
import { create } from "zustand";
import { LengthUnits } from "../utils/units";
import { defaultConfig } from "../presets/presetManager";
import { unit } from "mathjs";

export interface BeamstopStore{
  beamstop: AppBeamstop
  updateCentre: (centre: Partial<SimpleVector2>) => void;
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) => void;
  updateDiameterUnits: (newUnits: LengthUnits) => void;
  updateClearance: (newClearnace: number | null) => void;
  updateBeamstop: (presetBeamstop: AppBeamstop) => void;
}

/**
 * Zustand store for the beamstop
 */
export const useBeamstopStore = create<BeamstopStore>((set) => ({
  beamstop: defaultConfig.beamstop,
  updateCentre: (newCentre: Partial<SimpleVector2>) =>
    set((state) => ({
       beamstop: { 
        ...state.beamstop,
        centre: { ...state.beamstop.centre, ...newCentre } }})),
  updateDiameter: (newDiameter: number, newUnits: LengthUnits) =>
    set((state) => ({ 
      beamstop: {
        ...state.beamstop,
        diameter: unit(newDiameter, newUnits as string) 
      }})),
  updateDiameterUnits: (newUnits: LengthUnits) =>
    set((state) => ({ 
      beamstop: {
        ...state.beamstop, 
        diameter: state.beamstop.diameter.to(newUnits as string) }})),
  updateClearance: (newClearnace: number | null) =>
    set((state) => ({
      beamstop:{ 
        ...state.beamstop,
        clearance: newClearnace }})),
  updateBeamstop: (presetBeamstop: AppBeamstop) => 
    set({beamstop: presetBeamstop}),
}));
