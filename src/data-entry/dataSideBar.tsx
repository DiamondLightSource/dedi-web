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

/**
 * React component which represents the side bar for data entry
 * @returns
 */
export default function DataSideBar(): JSX.Element {
  const detector = useDetectorStore();
  const detectorList = useDetectorStore((state) => state.detectorList);

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
            value={detector.name}
            onChange={(_, value) => {
              value ? detector.updateDetector(value) : {};
            }}
          />
          <Typography>
            Resolution (hxw): {detector.resolution.height} x{" "}
            {detector.resolution.width}
          </Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>
              Pixel size: {detector.pixelSize.height.toString()} x{" "}
              {detector.pixelSize.width.toString()}
            </Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                label="units"
                value={detector.pixelSize.height.formatUnits()}
                onChange={(event) =>
                  detector.updatePixelUnits(event.target.value as DistanceUnits)
                }
              >
                <MenuItem value={DistanceUnits.millimetre}>
                  {DistanceUnits.millimetre} x {DistanceUnits.millimetre}
                </MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {DistanceUnits.micrometre} x {DistanceUnits.micrometre}
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
