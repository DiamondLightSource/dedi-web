import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useDetectorStore } from "./data-entry/detectorStore";
import { createAppConfig } from "./presets/presetManager";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useBeamlineConfigStore } from "./data-entry/beamlineconfigStore";
import { useState } from "react";
import { useBeamstopStore } from "./data-entry/beamstopStore";
import { useCameraTubeStore } from "./data-entry/cameraTubeStore";
import {
  AngleUnits,
  EnergyUnits,
  wavelength2EnergyConverter,
  WavelengthUnits,
} from "./utils/units";
import React from "react";
import AppConfigDialog from "./dialogs/preset/appConfigDialog";

export default function BasicAppBar() {
  const detectorStore = useDetectorStore();
  const beamlineConfigStore = useBeamlineConfigStore();
  const presetConfigRecord = beamlineConfigStore.presetRecord;
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();
  const [openBeamline, setOpenBeamline] = React.useState(false);

  const [preset, setPreset] = useState<string>(
    Object.keys(presetConfigRecord)[0],
  );

  const handleClickOpenPreset = () => {
    setOpenBeamline(true);
  };

  const handleClosePreset = () => {
    setOpenBeamline(false);
  };

  const handlePreset = (preset: string) => {
    const appConfig = createAppConfig(presetConfigRecord[preset]);
    detectorStore.updateDetector(appConfig.detector);
    beamstopStore.updateBeamstop(appConfig.beamstop);
    cameraTubeStore.updateCameraTube(appConfig.cameraTube);
    beamlineConfigStore.update({ beamline: appConfig.beamline });
    beamlineConfigStore.updateWavelengthUnits(WavelengthUnits.nanometres);
    beamlineConfigStore.updateAngleUnits(AngleUnits.degrees);
    const newEnergy = wavelength2EnergyConverter(appConfig.beamline.wavelength);
    beamlineConfigStore.updateEnergy(
      newEnergy.to(EnergyUnits.kiloElectronVolts).toNumber(),
      EnergyUnits.kiloElectronVolts,
    );
    setPreset(preset);
  };
  return (
    <AppBar style={{ width: "100%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dedi Web
        </Typography>
        <Autocomplete
          size="small"
          options={Object.keys(presetConfigRecord)}
          value={preset}
          sx={{ width: 250, color: "white" }}
          renderInput={(params) => (
            <TextField {...params} label="preset" sx={{ color: "black" }} />
          )}
          onChange={(_, value) => (value ? handlePreset(value) : {})}
        />
        <Button
          variant="outlined"
          sx={{ color: "black" }}
          onClick={handleClickOpenPreset}
        >
          Presets
        </Button>
        <AppConfigDialog
          open={openBeamline}
          handleClose={handleClosePreset}
          handleOpen={handleClickOpenPreset}
        />
      </Toolbar>
    </AppBar>
  );
}
