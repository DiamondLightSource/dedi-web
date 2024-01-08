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
import { DistanceUnits } from "../utils/units";

export default function CameraTubeDataEntry(): JSX.Element {
  const cameraTube = useCameraTubeStore();
  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTube.updateCentre({
      x: parseFloat(event.target.value),
    });
  };
  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTube.updateCentre({
      y: parseFloat(event.target.value),
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6"> CameraTube </Typography>
      <Stack direction={"row"}>
        <Typography flexGrow={2}>
          {" "}
          Diameter: {cameraTube.diameter.toNumber()}{" "}
        </Typography>
        <FormControl>
          <InputLabel>units </InputLabel>
          <Select
            size="small"
            label="units"
            value={cameraTube.diameter.formatUnits()}
            onChange={(event) =>
              cameraTube.updateDiameterUnits(
                event.target.value as DistanceUnits,
              )
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
      <Stack direction={"row"}>
        <Typography flexGrow={2}>x: </Typography>
        <TextField
          type="number"
          size="small"
          value={cameraTube.centre.x}
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
          value={cameraTube.centre.y}
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
