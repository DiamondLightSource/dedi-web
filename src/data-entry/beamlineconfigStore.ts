import { BeamlineConfig } from "../utils/types";
import { create } from "zustand";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";

export interface BeamlineConfigStore extends BeamlineConfig {
    beamEnergyUnits: EnergyUnits;
    angleUnits: AngleUnits;
    wavelengthUnits: WavelengthUnits;
    energy: number | null;
    wavelength: number | null;
    updateEnergyUnits: (newUnits: EnergyUnits) => void;
    updateAngleUnits: (newUnits: AngleUnits) => void;
    updateWavelengthUnits: (newUnits: WavelengthUnits) => void;
    updateEnergy: (newEnergy: number | null) => void;
    updateAngle: (newAngle: number | null) => void;
    updateWavelength: (newWavelength: number | null) => void;
}

export const useBeamlineConfigStore = create<BeamlineConfigStore>((set) => ({
    angle: 1,
    cameraLength: 1,
    minWavelength: 1,
    maxWavelength: 1,
    minCameraLength: 1,
    maxCameraLength: 1,
    energy: null,
    wavelength: null,
    beamEnergyUnits: EnergyUnits.kiloElectronVolts,
    angleUnits: AngleUnits.radians,
    wavelengthUnits: WavelengthUnits.nanmometres,
    updateEnergyUnits: (newUnits: EnergyUnits) =>
        set({ beamEnergyUnits: newUnits }),
    updateAngleUnits: (newUnits: AngleUnits) => set({ angleUnits: newUnits }),
    updateWavelengthUnits: (newUnits: WavelengthUnits) =>
        set({ wavelengthUnits: newUnits }),
    updateEnergy: (newEnergy: number | null) => set({ energy: newEnergy }),
    updateAngle: (newAngle: number | null) => set({ angle: newAngle }),
    updateWavelength: (newWavelength: number | null) =>
        set({ wavelength: newWavelength }),
}));
