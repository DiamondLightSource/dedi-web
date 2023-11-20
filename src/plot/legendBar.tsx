import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { PlotAxes, usePlotStore } from "./plotStore";
import ColourPickerPopover from "../utils/colourPicker";
import { ColorResult } from "react-color";


export default function LegendBar(): JSX.Element {
  const plotConfig = usePlotStore();


  const handleDetectorColourChange = (color: ColorResult) => {
    plotConfig.update({ detectorColour: color.rgb })
  }

  const handleCameraTubeColourChange = (color: ColorResult) => {
    plotConfig.update({ cameraTubeColor: color.rgb })
  }

  return (
    <Card sx={{ height: 1, width: 1 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6"> Legend</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.detector}
                  onChange={(_, checked) =>
                    plotConfig.update({ detector: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover color={plotConfig.detectorColour} onChangeComplete={handleDetectorColourChange} />
                  <Typography>Detector:</Typography>
                </Stack>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.cameraTube}
                  onChange={(_, checked) =>
                    plotConfig.update({ cameraTube: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover color={plotConfig.cameraTubeColor} onChangeComplete={handleCameraTubeColourChange} />
                  <Typography>Camera Tube:</Typography>
                </Stack>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.beamstop}
                  onChange={(_, checked) => {
                    plotConfig.update({ beamstop: checked });
                    plotConfig.update({ qrange: checked });
                  }}
                />
              }
              label="Beamstop"

            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.qrange}
                  onChange={(_, checked) =>
                    plotConfig.update({ qrange: checked })
                  }
                />
              }
              label="Q range"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.mask}
                  onChange={(_, checked) =>
                    plotConfig.update({ mask: checked })
                  }
                />
              }
              label="Mask"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.calibrantInPlot}
                  onChange={(_, checked) =>
                    plotConfig.update({ calibrantInPlot: checked })
                  }
                />
              }
              label="Calibrant"
            />
          </FormGroup>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Axes:</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={plotConfig.plotAxes}
              name="radio-buttons-group"
              onChange={(event) =>
                plotConfig.update({ plotAxes: event.target.value as PlotAxes })
              }
            >
              <FormControlLabel
                value={PlotAxes.milimeter}
                control={<Radio />}
                label="Axes in mm"
              />
              <FormControlLabel
                value={PlotAxes.pixel}
                control={<Radio />}
                label="Axes in pixels"
              />
              <FormControlLabel
                value={PlotAxes.reciprocal}
                control={<Radio />}
                label="Axes in q(nm^-1)"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
