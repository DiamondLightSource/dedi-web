import { configureStore } from "@reduxjs/toolkit";
import { beamlineConfigReducer } from "./data-entry/configSlice";
import { unitConfigReducer } from "./data-entry/unitSlice";

const store = configureStore({
  reducer: {
    config: beamlineConfigReducer,
    units: unitConfigReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
