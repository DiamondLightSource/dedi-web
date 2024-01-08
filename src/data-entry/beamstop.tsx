import {
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField
} from "@mui/material";
import { DistanceUnits } from "../utils/units";
import { useBeamstopStore } from "./beamstopStore";
import { useDetectorStore } from "./detectorStore";

export default function BeamStopDataEntry(): JSX.Element {
  const beamstop = useBeamstopStore();

  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstop.updateCentre({
      x: parseFloat(event.target.value),
    });
  };

  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstop.updateCentre({
      y: parseFloat(event.target.value),
    });
  };

  const handleClearance = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstop.updateClearance(parseFloat(event.target.value));
  };

  const detector = useDetectorStore();

  const centreDetector = () => {
    beamstop.updateCentre({
      x: detector.resolution.width / 2,
      y: detector.resolution.height / 2,
    });
  };

  const centreTopEdge = () => {
    beamstop.updateCentre({ x: detector.resolution.width / 2, y: 0 });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6"> Beamstop </Typography>
      <Stack direction={"row"}>
        <Typography flexGrow={2}>
          {" "}
          Diameter: {beamstop.diameter.toNumber()}{" "}
        </Typography>
        <FormControl>
          <InputLabel>units </InputLabel>
          <Select
            size="small"
            label="units"
            value={beamstop.diameter.formatUnits()}
            onChange={(event) =>
              beamstop.updateDiameterUnits(event.target.value as DistanceUnits)
            }
          >
            <MenuItem value={DistanceUnits.millimetre}>{"mm"}</MenuItem>
            <MenuItem value={DistanceUnits.micrometre}>
              {"\u03bc" + "m"}
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Typography>Position:</Typography>
      <Stack direction={"row"} spacing={2}>
        <Typography flexGrow={2}>x: </Typography>
        <TextField
          type="number"
          size="small"
          value={beamstop.centre.x}
          onChange={handleX}
        />
        <Typography flexGrow={2} align="center">
          {" "}
          px
        </Typography>
        <Button size="small" variant="outlined" onClick={centreDetector}>
          Centre detector
        </Button>
      </Stack>
      <Stack direction={"row"} spacing={1}>
        <Typography flexGrow={2}>y: </Typography>
        <TextField
          type="number"
          size="small"
          value={beamstop.centre.y}
          onChange={handleY}
        />
        <Typography flexGrow={2} align="center">
          {" "}
          px
        </Typography>
        <Button size="small" variant="outlined" onClick={centreTopEdge}>
          Centre top edge
        </Button>
      </Stack>
      <Stack direction="row">
        <Stack direction="row" spacing={1}>
          <Typography flexGrow={1}>Clearance: </Typography>
          <TextField
            type="number"
            size="small"
            value={beamstop.clearance}
            onChange={handleClearance}
          />
          <Typography>px</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
