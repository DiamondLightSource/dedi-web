import {
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
} from "@mui/material";
import { LengthUnits } from "../utils/units";
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
    <Card sx={{ maxHeight: "92vh", overflow: "scroll"}}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Beamline</Typography>
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
              Add beamline
            </Button>
            <PresetDialog
              open={openBeamline}
              handleClose={handleClosePreset}
              handleOpen={handleClickOpenPreset}
            />
          </Stack>
          <Divider />
          <Typography variant="h6">Detector</Typography>
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
              Add detector
            </Button>
            <DetectorDialog
              open={openDetector}
              handleClose={handleCloseDetector}
              handleOpen={handleClickOpenDetector}
            />
          </Stack>

          <Typography>
            Resolution (hxw): {detectorStore.detector.resolution.height} x{" "}
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
                  {"\u03BC" + "m"} x {"\u03BC" + "m"}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider />
          <BeamStopDataEntry />
          <Divider />
          <CameraTubeDataEntry />
          <Divider />
          <BeampropertiesDataEntry />
        </Stack>
      </CardContent>
    </Card>
  );
}
