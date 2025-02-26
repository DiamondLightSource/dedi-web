import {
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Card,
} from "@mui/material";
import { LengthUnits, MuSymbol } from "../utils/units";
import { useBeamstopStore } from "./beamstopStore";
import { useDetectorStore } from "./detectorStore";
import { AppDetector } from "../utils/types";

/**
 * Component with data entry inputs for the Beamstop
 * @returns
 */
export default function BeamStopDataEntry(): JSX.Element {
  const beamstopStore = useBeamstopStore();

  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateCentre({
      x: parseFloat(event.target.value),
    });
  };

  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateCentre({
      y: parseFloat(event.target.value),
    });
  };

  const handleClearance = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateClearance(parseFloat(event.target.value));
  };

  const detector = useDetectorStore<AppDetector>((state) => state.detector);

  const centreDetector = () => {
    beamstopStore.updateCentre({
      x: detector.resolution.width / 2,
      y: detector.resolution.height / 2,
    });
  };

  const centreTopEdge = () => {
    beamstopStore.updateCentre({ x: detector.resolution.width / 2, y: 0 });
  };
  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack spacing={1}>
        <Typography variant="h6"> Beamstop </Typography>
        <Divider />
        <Stack direction={"row"} alignItems={"center"}>
          {/* Diameter */}
          <Typography flexGrow={1}>
            Diameter: {beamstopStore.beamstop.diameter.toNumber().toFixed(2)}
          </Typography>
          <FormControl>
            <InputLabel>units </InputLabel>
            <Select
              size="small"
              label="units"
              value={beamstopStore.beamstop.diameter.formatUnits()}
              onChange={(event) =>
                beamstopStore.updateDiameterUnits(
                  event.target.value as LengthUnits,
                )
              }
            >
              <MenuItem value={LengthUnits.millimetre as string}>
                {LengthUnits.millimetre}
              </MenuItem>
              <MenuItem value={LengthUnits.micrometre as string}>
                {MuSymbol + "m"}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {/* Position */}
        <Typography>Position:</Typography>
        <Stack direction={"row"} spacing={1}>
          <TextField
            type="number"
            size="small"
            label="x"
            value={beamstopStore.beamstop.centre.x}
            onChange={handleX}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <Button size="small" variant="outlined" onClick={centreDetector}>
            Centre detector
          </Button>
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <TextField
            type="number"
            size="small"
            label="y"
            value={beamstopStore.beamstop.centre.y}
            onChange={handleY}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
          <Button size="small" variant="outlined" onClick={centreTopEdge}>
            Centre top edge
          </Button>
        </Stack>
        <Stack direction="row">
          <TextField
            type="number"
            size="small"
            label="clearance"
            value={beamstopStore.beamstop.clearance}
            onChange={handleClearance}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
