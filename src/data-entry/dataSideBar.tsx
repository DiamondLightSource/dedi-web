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
} from "@mui/material";
import { DistanceUnits } from "../utils/units";
import BeamStopDataEntry from "./beamstop";
import CameraTubeDataEntry from "./cameraTube";
import { useDetectorStore } from "./detectorStore";
import BeampropertiesDataEntry from "./beamProperties";
import { presetList } from "../presets/presetManager";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import { useBeamstopStore } from "./beamstopStore";
import { useCameraTubeStore } from "./cameraTubeStore";

export default function DataSideBar(): JSX.Element {
  const name = useDetectorStore((state) => state.name);
  const resolution = useDetectorStore((state) => state.current.resolution);
  const pixelSize = useDetectorStore((state) => {
    if (state.pixelUnits === DistanceUnits.micrometre) {
      return 1000 * state.current.pixelSize;
    }
    return state.current.pixelSize;
  });
  const detectorList = useDetectorStore((state) => state.detectorList);
  const pixelUnits = useDetectorStore((state) => state.pixelUnits);
  const updateUnits = useDetectorStore((state) => state.updateUnits);
  const updateDetector = useDetectorStore((state) => state.updateDetector);

  const preset = useBeamlineConfigStore((state) => state.preset);
  const updateBeamstop = useBeamstopStore((state) => state.updateBeamstop)
  const updateCameraTube = useCameraTubeStore((state) => state.updateCameraTube)
  const updateBeamlineConfig = useBeamlineConfigStore((state) => state.updateBeamlineConfig)
  const updatePreset = useBeamlineConfigStore((state) => state.updatePreset)
  const handlePreset = (preset: string) => {
    const { beamstop, cameraTube, detector, ...beamlineConfig } = presetList[preset];
    updateDetector(detector);
    updateBeamstop(beamstop);
    updateCameraTube(cameraTube);
    updateBeamlineConfig(beamlineConfig);
    updatePreset(preset)
  }

  return (
    <Card sx={{ height: 1 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Configuration</Typography>
          <Divider></Divider>
          <Typography> Predefined Configuration Templates</Typography>
          <Stack direction={"row"}>
            <Autocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              options={Object.keys(presetList)}
              value={preset}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="choose beamline config" />
              )}
              onChange={(_, value) => {
                value ? handlePreset(value) : {};
              }}
            />
          </Stack>
          <Divider />
          <Typography variant="h6">Detector</Typography>
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={Object.keys(detectorList)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="choose detector type" />
            )}
            value={name}
            onChange={(_, value) => {
              value ? updateDetector(value) : {};
            }}
          />
          <Typography>
            Resolution: {resolution.height} x {resolution.width}
          </Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Pixel size: {pixelSize} </Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                label="units"
                value={pixelUnits}
                onChange={(event) =>
                  updateUnits(event.target.value as DistanceUnits)
                }
              >
                <MenuItem value={DistanceUnits.millimetre}>
                  {DistanceUnits.millimetre}x{DistanceUnits.millimetre}
                </MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {DistanceUnits.micrometre}x{DistanceUnits.micrometre}
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
