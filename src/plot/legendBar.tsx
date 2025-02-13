import {
  Autocomplete,
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
  TextField,
  Typography,
} from "@mui/material";
import { PlotAxes, usePlotStore } from "./plotStore";
import ColourPickerPopover from "../utils/colourPicker";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";

export default function LegendBar(): JSX.Element {
  const plotConfig = usePlotStore();
  const detector = useDetectorStore((store) => store.detector);
  const cameraTube = useCameraTubeStore((store) => store.cameraTube);

  const handleCalibrantUpdate = (
    _: React.SyntheticEvent,
    value: string | null,
  ) => {
    if (value) {
      plotConfig.update({ currentCalibrant: value });
    }
  };

  return (
    <Card sx={{ flexGrow: 1, overflow: "scroll" }} variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6"> Legend</Typography>
          <Divider />
          <FormGroup>
            {/* Detector */}
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
                  <ColourPickerPopover
                    color={plotConfig.detectorColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ detectorColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Detector
                  </Typography>
                </Stack>
              }
            />

            {/* Beamstop */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.beamstop}
                  onChange={(_, checked) => {
                    plotConfig.update({ beamstop: checked });
                  }}
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.beamstopColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ beamstopColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Beamstop
                  </Typography>
                </Stack>
              }
            />
            {/* Clearance */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.clearance}
                  onChange={(_, checked) => {
                    plotConfig.update({ clearance: checked });
                  }}
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.clearanceColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ clearanceColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Clearance
                  </Typography>
                </Stack>
              }
            />
            {/* Visible Range */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.visibleRange}
                  onChange={(_, checked) =>
                    plotConfig.update({ visibleRange: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.visibleColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ visibleColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Visible Range
                  </Typography>
                </Stack>
              }
            />
            {/* Requested Range */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.requestedRange}
                  onChange={(_, checked) =>
                    plotConfig.update({ requestedRange: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.requestedRangeColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ requestedRangeColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Requested Range
                  </Typography>
                </Stack>
              }
            />
            {/* Inaccessible Range */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.inaccessibleRange}
                  onChange={(_, checked) =>
                    plotConfig.update({ inaccessibleRange: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.inaccessibleRangeColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ inaccessibleRangeColor: color.rgb })
                    }
                  />
                  <Typography display={"flex"} alignItems={"center"}>
                    Inaccessible Range
                  </Typography>
                </Stack>
              }
            />
            {/* Camera Tube */}
            {cameraTube && (
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
                    <ColourPickerPopover
                      color={plotConfig.cameraTubeColor}
                      onChangeComplete={(color) =>
                        plotConfig.update({ cameraTubeColor: color.rgb })
                      }
                    />
                    <Typography display={"flex"} alignItems={"center"}>
                      Camera Tube
                    </Typography>
                  </Stack>
                }
              />
            )}
            {/* Mask */}
            {detector.mask && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={plotConfig.mask}
                    onChange={(_, checked) =>
                      plotConfig.update({ mask: checked })
                    }
                  />
                }
                label={
                  <Stack direction={"row"}>
                    <ColourPickerPopover
                      color={plotConfig.maskColor}
                      onChangeComplete={(color) =>
                        plotConfig.update({ maskColor: color.rgb })
                      }
                    />
                    <Typography display={"flex"} alignItems={"center"}>
                      Mask
                    </Typography>
                  </Stack>
                }
              />
            )}

            {/* Calibrant */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={plotConfig.calibrant}
                  onChange={(_, checked) =>
                    plotConfig.update({ calibrant: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"}>
                  <ColourPickerPopover
                    color={plotConfig.calibrantColor}
                    onChangeComplete={(color) =>
                      plotConfig.update({ calibrantColor: color.rgb })
                    }
                  />
                  <Autocomplete
                    size="small"
                    options={Object.keys(plotConfig.calibrantRecord)}
                    value={plotConfig.currentCalibrant}
                    sx={{ width: 300, color: "white" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="choose calibrant"
                        sx={{ color: "white" }}
                      />
                    )}
                    onChange={handleCalibrantUpdate}
                  />
                </Stack>
              }
            />
          </FormGroup>
          {/* Axis control */}
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
          <Stack direction={"row"} spacing={1}></Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
