import {
  Card,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Divider,
} from "@mui/material";
import { LengthUnits, MuSymbol } from "../utils/units";
import BeamStopDataEntry from "./beamstop";
import CameraTubeDataEntry from "./cameraTube";
import BeampropertiesDataEntry from "./beamProperties";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import { useDetectorStore } from "./detectorStore";
import DetectorDialog from "../dialogs/detectorDialog";
import React from "react";
import PresetDialog from "../dialogs/beamlineDialog";
import { useBeamstopStore } from "./beamstopStore";
import { useCameraTubeStore } from "./cameraTubeStore";

/**
 * React components which represents the whole side bar for data entry.
 * @returns
 */
export default function DataSideBar(): JSX.Element {
  const detectorStore = useDetectorStore();
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();
  const beamlineConfigStore = useBeamlineConfigStore();

  const [openDetector, setOpenDetector] = React.useState(false);

  const handleClickOpenDetector = () => {
    setOpenDetector(true);
  };

  const handleCloseDetector = () => {
    setOpenDetector(false);
  };

  const [openBeamline, setOpenBeamline] = React.useState(false);

  const handleClickOpenPreset = () => {
    setOpenBeamline(true);
  };

  const handleClosePreset = () => {
    setOpenBeamline(false);
  };

  const handleBeamlineUpdate = (
    _: React.SyntheticEvent,
    value: string | null,
  ) => {
    if (value) {
      beamlineConfigStore.updateBeamline(value);
      beamstopStore.updateDiameter(
        beamlineConfigStore.beamlineRecord[value].beamstopDiameter,
        LengthUnits.millimetre,
      );
      cameraTubeStore.updateDiameter(
        beamlineConfigStore.beamlineRecord[value].cameratubeDiameter,
        LengthUnits.millimetre,
      );
    }
  };

  return (
    <Stack maxHeight={{ lg: "91vh" }} overflow={{ lg: "scroll" }}>
      <Stack spacing={1}>
        <Card sx={{ p: 2 }} variant="outlined">
          <Stack spacing={1}>
            <Typography variant="h6">Beamline</Typography>
            <Divider />
            <Stack direction={"row"} spacing={1}>
              <Autocomplete
                size="small"
                options={Object.keys(beamlineConfigStore.beamlineRecord)}
                value={beamlineConfigStore.beamlineName}
                sx={{ width: 300, color: "white" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="choose beamline"
                    sx={{ color: "white" }}
                  />
                )}
                onChange={handleBeamlineUpdate}
              />
              <Button variant="outlined" onClick={handleClickOpenPreset}>
                Beamlines
              </Button>
              <PresetDialog
                open={openBeamline}
                handleClose={handleClosePreset}
                handleOpen={handleClickOpenPreset}
              />
            </Stack>
          </Stack>
        </Card>
        <Card sx={{ p: 2 }} variant="outlined">
          <Stack spacing={1}>
            <Typography variant="h6">Detector</Typography>
            <Divider />
            <Stack direction={"row"} spacing={1}>
              <Autocomplete
                size="small"
                options={Object.keys(detectorStore.detectorRecord)}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="choose detector" />
                )}
                value={detectorStore.name}
                onChange={(_, value) => {
                  value ? detectorStore.updateDetector(value) : {};
                }}
              />
              <Button variant="outlined" onClick={handleClickOpenDetector}>
                {" "}
                Detectors
              </Button>
              <DetectorDialog
                open={openDetector}
                handleClose={handleCloseDetector}
                handleOpen={handleClickOpenDetector}
              />
            </Stack>
            <Typography>
              Resolution (hxw):
              {detectorStore.detector.resolution.height} x{" "}
              {detectorStore.detector.resolution.width}
            </Typography>
            <Stack direction="row" alignItems={"center"}>
              <Typography flexGrow={2}>
                Pixel size:{" "}
                {detectorStore.detector.pixelSize.height.toNumber().toFixed(2)}
                {" x "}
                {detectorStore.detector.pixelSize.width.toNumber().toFixed(2)}
              </Typography>
              <FormControl>
                <InputLabel>units</InputLabel>
                <Select
                  size="small"
                  label="units"
                  value={detectorStore.detector.pixelSize.height.formatUnits()}
                  onChange={(event) =>
                    detectorStore.updatePixelUnits(
                      event.target.value as LengthUnits,
                    )
                  }
                >
                  <MenuItem value={LengthUnits.millimetre}>
                    {LengthUnits.millimetre} x {LengthUnits.millimetre}
                  </MenuItem>
                  <MenuItem value={LengthUnits.micrometre}>
                    {MuSymbol + "m"} x {MuSymbol + "m"}
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Card>
        <Card sx={{ p: 2 }} variant="outlined">
          <BeamStopDataEntry />
        </Card>
        <Card sx={{ p: 2 }} variant="outlined">
          <CameraTubeDataEntry />
        </Card>
        <Card sx={{ p: 2 }} variant="outlined">
          <BeampropertiesDataEntry />
        </Card>
      </Stack>
    </Stack>
  );
}
