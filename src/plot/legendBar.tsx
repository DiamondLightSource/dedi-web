import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import {
  PlotAxes
} from "./plotStore";

export default function LegendBar(): JSX.Element {
  return (
    <Card sx={{ height: 1, width: 1 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6"> Legend</Typography>
          <Typography>Add something to do with colors here</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Detector" />
            <FormControlLabel control={<Checkbox />} label="Beamstop" />
            <FormControlLabel control={<Checkbox />} label="Camera tube" />
            <FormControlLabel control={<Checkbox />} label="Q range" />
            <FormControlLabel control={<Checkbox />} label="Mask" />
            <FormControlLabel control={<Checkbox />} label="Calibrant" />
          </FormGroup>
          <Divider />
          <Typography>Calibrant: {5}</Typography>
          <Divider />
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Axes:</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel value={PlotAxes.milimeter} control={<Radio />} label="Axes in mm" />
              <FormControlLabel value={PlotAxes.pixel} control={<Radio />} label="Axes in pixels" />
              <FormControlLabel value={PlotAxes.reciprocal} control={<Radio />} label="Axes in q(nm^-1)" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
