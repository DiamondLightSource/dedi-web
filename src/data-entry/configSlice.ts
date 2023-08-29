import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import testBeamlineConfig from "../presets/presetConfigs.json";
import { BeamlineConfig } from "../utils/types";
import { RootState } from "../store";

const beamlineConfigSlice = createSlice({
  name: "config",
  initialState: (testBeamlineConfig as Record<string, BeamlineConfig>).test,
  reducers: {
    editConfig: (state, action: PayloadAction<Partial<BeamlineConfig>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const beamlineConfigReducer = beamlineConfigSlice.reducer;

export const { editConfig } = beamlineConfigSlice.actions;
export const configSelector = (state: RootState) => state.config;
