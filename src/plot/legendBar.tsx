import {
  Autocomplete,
  Box,
  Button,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { PlotAxes, usePlotStore } from "./plotStore";
import ColourPickerPopover from "../utils/colourPicker";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import React, { useEffect, useState } from "react";
import {
  CalibrantDialog,
  AddCalibrantDialog,
} from "../dialogs/calibrant/calibrantDialog";
import { secondaryButtonSx } from "../utils/styles";

export default function LegendBar(): React.JSX.Element {
  const plotConfig = usePlotStore();
  const detector = useDetectorStore((store) => store.detector);
  const cameraTube = useCameraTubeStore((store) => store.cameraTube);
  const beamlineConfig = useBeamlineConfigStore((s) => s.beamline);

  const canUseReciprocal =
    !isNaN(beamlineConfig.wavelength.toNumber()) &&
    beamlineConfig.cameraLength != null;

  // If reciprocal was selected but is no longer computable, fall back to mm.
  useEffect(() => {
    if (!canUseReciprocal && plotConfig.plotAxes === PlotAxes.reciprocal) {
      plotConfig.update({ plotAxes: PlotAxes.millimetre });
    }
  }, [canUseReciprocal, plotConfig]);

  const handleCalibrantUpdate = (
    _: React.SyntheticEvent,
    value: string | null,
  ) => {
    if (value) {
      plotConfig.update({ currentCalibrant: value });
    }
  };

  const [calibrantDialogOpen, setCalibrantDialogOpen] = useState(false);
  const [addCalibrantDialogOpen, setAddCalibrantDialogOpen] = useState(false);

  return (
    <Card
      variant="outlined"
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Plot Controls
        </Typography>
      </Box>
      <CardContent sx={{ overflow: "auto" }}>
        <Stack spacing={1}>
          <FormGroup>
            {/* Detector */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    Detector
                  </Typography>
                </Stack>
              }
            />

            {/* Beamstop */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    Beamstop
                  </Typography>
                </Stack>
              }
            />
            {/* Clearance */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    Clearance
                  </Typography>
                </Stack>
              }
            />
            {/* Visible Range */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    Visible Range
                  </Typography>
                </Stack>
              }
            />
            {/* Requested Range */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
                    Requested Range
                  </Typography>
                </Stack>
              }
            />
            {/* Inaccessible Range */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  <Typography
                    variant="body2"
                    display={"flex"}
                    alignItems={"center"}
                  >
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
                    size="small"
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
                    <Typography
                      variant="body2"
                      display={"flex"}
                      alignItems={"center"}
                    >
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
                    size="small"
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
                    <Typography
                      variant="body2"
                      display={"flex"}
                      alignItems={"center"}
                    >
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
                  size="small"
                  checked={plotConfig.calibrant}
                  onChange={(_, checked) =>
                    plotConfig.update({ calibrant: checked })
                  }
                />
              }
              label={
                <Stack direction={"row"} spacing={1} alignItems="center">
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
                    style={{ width: 240, color: "white" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="choose calibrant"
                        sx={{ color: "white" }}
                      />
                    )}
                    onChange={handleCalibrantUpdate}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      ...secondaryButtonSx,
                      fontSize: "0.7rem",
                      whiteSpace: "nowrap",
                      height: 40,
                    }}
                    onClick={() => setCalibrantDialogOpen(true)}
                  >
                    Show all
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      ...secondaryButtonSx,
                      fontSize: "0.7rem",
                      whiteSpace: "nowrap",
                      height: 40,
                    }}
                    onClick={() => setAddCalibrantDialogOpen(true)}
                  >
                    Add
                  </Button>
                </Stack>
              }
            />
          </FormGroup>
          <CalibrantDialog
            open={calibrantDialogOpen}
            handleClose={() => setCalibrantDialogOpen(false)}
            calibrantRecord={plotConfig.calibrantRecord}
            userCalibrantNames={new Set(Object.keys(plotConfig.userCalibrantRecord))}
            onDelete={(name) => plotConfig.deleteCalibrant(name)}
          />
          <AddCalibrantDialog
            open={addCalibrantDialogOpen}
            handleClose={() => setAddCalibrantDialogOpen(false)}
            onAdd={(name, calibrant) =>
              plotConfig.addCalibrant(name, calibrant)
            }
          />
          {/* Axis control */}
          <FormControl>
            <FormLabel
              id="plot-axes-label"
              sx={{ typography: "body2", mb: 0.5 }}
            >
              Axes
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="plot-axes-label"
              value={plotConfig.plotAxes}
              name="radio-buttons-group"
              onChange={(event) =>
                plotConfig.update({ plotAxes: event.target.value as PlotAxes })
              }
            >
              <FormControlLabel
                value={PlotAxes.millimetre}
                control={<Radio size="small" />}
                label="mm"
              />
              <FormControlLabel
                value={PlotAxes.pixel}
                control={<Radio size="small" />}
                label="pixels"
              />
              <Tooltip
                title={
                  canUseReciprocal
                    ? ""
                    : "Wavelength and camera length must both be set to plot in reciprocal units"
                }
                placement="right"
              >
                <span>
                  <FormControlLabel
                    value={PlotAxes.reciprocal}
                    control={<Radio size="small" />}
                    label="q (nm⁻¹)"
                    disabled={!canUseReciprocal}
                  />
                </span>
              </Tooltip>
            </RadioGroup>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
