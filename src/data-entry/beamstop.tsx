import {
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import { DistanceUnits } from "../utils/units";
import { useBeamstopStore } from "./beamstopStore";
import { useDetectorStore } from "./detectorStore";

export default function BeamStopDataEntry(): JSX.Element {
  const centre = useBeamstopStore((state) => state.centre);
  const updateCentre = useBeamstopStore((state) => state.updateCentre);
  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCentre({
      x: parseFloat(event.target.value) ? parseFloat(event.target.value) : null,
    });
  };
  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCentre({
      y: parseFloat(event.target.value) ? parseFloat(event.target.value) : null,
    });
  };

  const diameter = useBeamstopStore((state) => {
    if (state.diameterUnits === DistanceUnits.micrometre) {
      return 1000 * state.diameter;
    }
    return state.diameter;
  });

  const diameterUnits = useBeamstopStore((state) => state.diameterUnits);
  const updateUnits = useBeamstopStore((state) => state.updateUnits);

  const clearance = useBeamstopStore((state) => state.clearance);
  const updateClearance = useBeamstopStore((state) => state.updateClearance);
  const handleClearance = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateClearance(
      parseFloat(event.target.value) ? parseFloat(event.target.value) : null,
    );
  };


  const detector = useDetectorStore((state) => state.current)
  const centreDetector = () => {
    updateCentre({ x: detector.resolution.width / 2, y: detector.resolution.height / 2 })
  }

  const centreTopEdge = () => {
    updateCentre({ x: detector.resolution.width / 2, y: 0 })
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6"> Beamstop </Typography>
      <Stack direction={"row"}>
        <Typography flexGrow={2}> Diameter: {diameter} </Typography>
        <FormControl>
          <InputLabel>units </InputLabel>
          <Select
            size="small"
            label="units"
            value={diameterUnits}
            onChange={(event) =>
              updateUnits(event.target.value as DistanceUnits)
            }
          >
            <MenuItem value={DistanceUnits.millimetre}>
              {DistanceUnits.millimetre}
            </MenuItem>
            <MenuItem value={DistanceUnits.micrometre}>
              {DistanceUnits.micrometre}
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
          value={centre.x ?? ""}
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
      <Stack direction={"row"} spacing={2}>
        <Typography flexGrow={2}>y: </Typography>
        <TextField
          type="number"
          size="small"
          value={centre.y ?? ""}
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
        <Stack direction="row" spacing={2}>
          <Typography flexGrow={1}>Clearance: </Typography>
          <TextField
            type="number"
            size="small"
            value={clearance ?? ""}
            onChange={handleClearance}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
