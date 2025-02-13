import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useDetectorStore } from "./data-entry/detectorStore";
import { createAppConfig, presetConfigRecord } from "./presets/presetManager";
import { Autocomplete, TextField } from "@mui/material";
import { useBeamlineConfigStore } from "./data-entry/beamlineconfigStore";
import { useState } from "react";
import { useBeamstopStore } from "./data-entry/beamstopStore";
import { useCameraTubeStore } from "./data-entry/cameraTubeStore";

export default function BasicAppBar(): JSX.Element {
  const [preset, setPreset] = useState<string>(
    Object.keys(presetConfigRecord)[0],
  );
  const detectorStore = useDetectorStore();
  const beamlineConfigStore = useBeamlineConfigStore();
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();

  const handlePreset = (preset: string) => {
    console.log("help");
    const appConfig = createAppConfig(presetConfigRecord[preset]);
    detectorStore.updateDetector(appConfig.detector);
    beamstopStore.updateBeamstop(appConfig.beamstop);
    cameraTubeStore.updateCameraTube(appConfig.cameraTube);
    beamlineConfigStore.update({ beamline: appConfig.beamline });
    setPreset(preset);
  };
  return (
    <AppBar style={{ position: "static", width: "100%" }}>
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
          onChange={(_, value) => {
            value ? handlePreset(value) : {};
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
