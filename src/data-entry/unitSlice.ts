import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  AngleUnits,
  DistanceUnits,
  EnergyUnits,
  UnitConfig,
  WavelengthUnits,
} from "../utils/units";

const defaultUnits: UnitConfig = {
  cameraDiameterUnits: DistanceUnits.millimetre,
  clearanceDiameterUnits: DistanceUnits.micrometre,
  beamEnergyUnits: EnergyUnits.electronVolts,
  pixelSizeUnits: DistanceUnits.millimetre,
  angleUnits: AngleUnits.radians,
  wavelengthUnits: WavelengthUnits.angstroms,
  beamstopDiameterUnits: DistanceUnits.millimetre,
};

const unitConfigSlice = createSlice({
  name: "unit-config",
  initialState: defaultUnits,
  reducers: {
    editUnits: (state, action: PayloadAction<Partial<UnitConfig>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { editUnits } = unitConfigSlice.actions;
export const unitConfigReducer = unitConfigSlice.reducer;
export const unitSelector = (state: RootState) => state.units;
