import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  AngleUnits,
  DistanceUnits,
  EnergyUnits,
  UnitConfig,
  WavelengthUnits,
} from "../utils/units";

// Note the app will do all calculations with these units in mind and then use
// redux selectors to display in units of your choice
const defaultUnits: UnitConfig = {
  cameraDiameterUnits: DistanceUnits.millimetre,
  clearanceDiameterUnits: DistanceUnits.millimetre,
  beamEnergyUnits: EnergyUnits.kiloElectronVolts,
  pixelSizeUnits: DistanceUnits.millimetre,
  angleUnits: AngleUnits.radians,
  wavelengthUnits: WavelengthUnits.nanmometres,
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
