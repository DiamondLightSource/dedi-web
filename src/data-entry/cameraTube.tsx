import {
  Card,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useCameraTubeStore } from "./cameraTubeStore";
import { LengthUnits, MuSymbol } from "../utils/units";
import React from "react";

/**
 * Component with inputs for cameratube data entry
 * @returns
 */
export default function CameraTubeDataEntry(): React.JSX.Element {
  const cameraTubeStore = useCameraTubeStore();
  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTubeStore.updateCentre({
      x: parseFloat(event.target.value),
    });
  };
  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTubeStore.updateCentre({
      y: parseFloat(event.target.value),
    });
  };

  if (!cameraTubeStore.cameraTube) {
    return (
      <Card sx={{ p: 2 }} variant="outlined">
        <Stack spacing={1}>
          <Typography variant="h6"> No CameraTube </Typography>
          <Divider />
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack spacing={1}>
        <Typography variant="h6"> CameraTube </Typography>
        <Divider />
        <Stack direction={"row"} alignItems={"center"}>
          <Typography flexGrow={1}>
            {" "}
            Diameter: {cameraTubeStore.cameraTube.diameter.toNumber()}{" "}
          </Typography>
          <FormControl>
            <InputLabel>units </InputLabel>
            <Select
              size="small"
              label="units"
              value={cameraTubeStore.cameraTube.diameter.formatUnits()}
              onChange={(event) =>
                cameraTubeStore.updateDiameterUnits(
                  event.target.value as LengthUnits,
                )
              }
            >
              <MenuItem value={LengthUnits.millimetre}>
                {LengthUnits.millimetre}
              </MenuItem>
              <MenuItem value={LengthUnits.micrometre}>
                {MuSymbol + "m"}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Typography>Position:</Typography>
        <TextField
          type="number"
          size="small"
          label="x"
          value={cameraTubeStore.cameraTube.centre.x}
          onChange={handleX}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>,
          }}
        />
        <TextField
          type="number"
          size="small"
          label="y"
          value={cameraTubeStore.cameraTube.centre.y}
          onChange={handleY}
          InputProps={{
            endAdornment: <InputAdornment position="end">px</InputAdornment>,
          }}
        />
      </Stack>
    </Card>
  );
}
