import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useCameraTubeStore } from "./cameraTubeStore";
import { DistanceUnits, millimetre2Micrometre, parseNumericInput } from "../utils/units";

export default function CameraTubeDataEntry(): JSX.Element {
  const centre = useCameraTubeStore((state) => state.centre);
  const updateCentre = useCameraTubeStore((state) => state.updateCentre);
  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCentre({
      x: parseNumericInput(event.target.value),
    });
  };
  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCentre({
      y: parseNumericInput(event.target.value),
    });
  };

  const diameter = useCameraTubeStore((state) => {
    if (state.diameterUnits === DistanceUnits.micrometre) {
      return millimetre2Micrometre(state.diameter);
    }
    return state.diameter;
  });

  const diameterUnits = useCameraTubeStore((state) => state.diameterUnits);
  const updateUnits = useCameraTubeStore((state) => state.updateUnits);

  return (
    <Stack spacing={2}>
      <Typography variant="h6"> CameraTube </Typography>
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
      <Stack direction={"row"}>
        <Typography flexGrow={2}>x: </Typography>
        <TextField
          type="number"
          size="small"
          value={centre.x}
          onChange={handleX}
        />
        <Typography flexGrow={2} align="center">
          {" "}
          px
        </Typography>
      </Stack>
      <Stack direction={"row"}>
        <Typography flexGrow={2}>y: </Typography>
        <TextField
          type="number"
          size="small"
          value={centre.y}
          onChange={handleY}
        />
        <Typography flexGrow={2} align="center">
          {" "}
          px
        </Typography>
      </Stack>
    </Stack>
  );
}
