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
import { DistanceUnits, millimetre2Micrometre } from "../utils/units";
import BeamStopDataEntry from "./beamstop";
import CameraTubeDataEntry from "./cameraTube";
import { useDetectorStore } from "./detectorStore";
import BeampropertiesDataEntry from "./beamProperties";

export default function DataSideBar(): JSX.Element {
  const name = useDetectorStore((state) => state.name);
  const resolution = useDetectorStore((state) => state.current.resolution);
  const pixelSize = useDetectorStore((state) => {
    if (state.pixelUnits === DistanceUnits.micrometre) {
      return {
        height: millimetre2Micrometre(state.current.pixelSize.height),
      width: millimetre2Micrometre(state.current.pixelSize.width)
    };
    }
    return state.current.pixelSize;
  });
  const detectorList = useDetectorStore((state) => state.detectorList);
  const pixelUnits = useDetectorStore((state) => state.pixelUnits);
  const updateUnits = useDetectorStore((state) => state.updateUnits);
  const updateDetector = useDetectorStore((state) => state.updateDetector);

  return (
    <Card sx={{ height: 1 }}>
      <CardContent>
        <Stack spacing={1}>
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
            Resolution (hxw): {resolution.height} x {resolution.width}
          </Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Pixel size: {pixelSize.height}x{pixelSize.width} </Typography>
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
