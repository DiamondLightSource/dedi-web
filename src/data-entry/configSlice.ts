import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import testBeamlineConfig from "../presets/presetConfigs.json";
import { BeamlineConfig } from "../utils/types";
import { RootState } from "../store";
import { detectorList } from "../presets/presetManager";
import {
  AngleUnits,
  DistanceUnits,
  EnergyUnits,
  WavelengthUnits,
} from "../utils/units";

interface BeamlineState extends BeamlineConfig {
  energy: number | null;
  wavelength: number | null;
}

const initialState = {
  ...testBeamlineConfig.test,
  energy: null,
  wavelength: null,
} as BeamlineState;

const beamlineConfigSlice = createSlice({
  name: "config",
  initialState: initialState,
  reducers: {
    editConfig: (state, action: PayloadAction<Partial<BeamlineState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const beamlineConfigReducer = beamlineConfigSlice.reducer;

export const { editConfig } = beamlineConfigSlice.actions;
export const configSelector = (state: RootState) => state.config;

// Unit selectors
export const pixelSizeSelector = (state: RootState) => {
  if (state.units.pixelSizeUnits === DistanceUnits.micrometre) {
    return 1000 * detectorList[state.config.detector].pixel_size;
  } else {
    return detectorList[state.config.detector].pixel_size;
  }
};

export const beamstopSelector = (state: RootState) => {
  if (state.units.beamstopDiameterUnits === DistanceUnits.micrometre) {
    return 1000 * state.config.beamstop.diameter;
  } else {
    return state.config.beamstop.diameter;
  }
};

export const clearanceSelector = (state: RootState) => {
  if (state.units.clearanceDiameterUnits === DistanceUnits.micrometre) {
    return 1000 * state.config.clearance;
  } else {
    return state.config.clearance;
  }
};

export const cameraTubeSelector = (state: RootState) => {
  if (state.units.cameraDiameterUnits === DistanceUnits.micrometre) {
    return 1000 * state.config.cameraTube.diameter;
  } else {
    return state.config.cameraTube.diameter;
  }
};

export const energySelector = (state: RootState) => {
  if (
    state.config.energy &&
    state.units.beamEnergyUnits === EnergyUnits.electronVolts
  ) {
    return 1000 * state.config.energy;
  } else {
    return state.config.energy;
  }
};

export const wavelengthSelector = (state: RootState) => {
  if (
    state.config.wavelength &&
    state.units.wavelengthUnits === WavelengthUnits.angstroms
  ) {
    return 10 * state.config.wavelength;
  } else {
    return state.config.wavelength;
  }
};

export const angleSelector = (state: RootState) => {
  if (state.config.angle && state.units.angleUnits === AngleUnits.degrees) {
    return state.config.angle * (180 / Math.PI);
  } else {
    return state.config.angle;
  }
};
