import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useDetectorStore } from "./data-entry/detectorStore";
import { presetConfigRecord } from "./presets/presetManager";
import { Autocomplete, TextField } from "@mui/material";
import { useBeamlineConfigStore } from "./data-entry/beamlineconfigStore";
import { useState } from "react";
import { useBeamstopStore } from "./data-entry/beamstopStore";
import { useCameraTubeStore } from "./data-entry/cameraTubeStore";
import { LengthUnits } from "./utils/units";

export default function BasicAppBar(): JSX.Element {
  const [preset, setPreset] = useState<string>(
    Object.keys(presetConfigRecord)[0],
  );
  const detectorStore = useDetectorStore();
  const beamlineConfigStore = useBeamlineConfigStore();
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();

  const handlePreset = (preset: string) => {
    const { beamstop, cameraTube, detector, beamline } =
      presetConfigRecord[preset];
    detectorStore.updateDetector(detector);
    beamstopStore.updateBeamstop(beamstop);
    cameraTubeStore.updateCameraTube(cameraTube);
    beamlineConfigStore.updateBeamline(beamline);
    beamstopStore.updateDiameter(
      beamlineConfigStore.beamlineRecord[beamline].beamstopDiameter,
      LengthUnits.millimetre,
    );
    cameraTubeStore.updateDiameter(
      beamlineConfigStore.beamlineRecord[beamline].cameratubeDiameter,
      LengthUnits.millimetre,
    );
    setPreset(preset);
  };

  return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dedi Web
          </Typography>
          <Autocomplete
            size="small"
            options={Object.keys(presetConfigRecord)}
            value={preset}
            sx={{ width: 300, color: "white" }}
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
