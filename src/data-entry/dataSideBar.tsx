import {
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  ButtonGroup,
  Input,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  DistanceUnits,
  EnergyUnits,
  WavelengthUnits,
  AngleUnits,
} from "../utils/units";
import { useDispatch, useSelector } from "react-redux";
import { configSelector, editConfig } from "./configSlice";
import { editUnits, unitSelector } from "./unitSlice";
import detectorData from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import { BeamlineConfig, Detector } from "../utils/types";
import { useState } from "react";


const detectorList = detectorData as Record<string, Detector>;
const presetList = presetData as Record<string, BeamlineConfig>;

export default function DataSideBar(): JSX.Element {
  const config = useSelector(configSelector);
  const units = useSelector(unitSelector);
  const dispatch = useDispatch();
  const [preset, setPreset] = useState<string | null>("test");

  const handlePresetChange = (preset: string): void => {
    setPreset(preset);
    dispatch(editConfig(presetList[preset]));
  };

  const handleDetectorChange = (detector: string): void => {
    dispatch(editConfig({ detector: detector }));
  };

  return (
    <Card sx={{ height: 1 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Configuration</Typography>
          <Divider></Divider>
          <Typography> Predefined Configuration Templates</Typography>
          <Stack direction={"row"}>
            <Autocomplete
              value={preset}
              size="small"
              disablePortal
              id="combo-box-demo"
              options={Object.keys(presetList)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="choose beamline config" />
              )}
              onChange={(_, value) => {
                value ? handlePresetChange(value) : {};
              }}
            />
          </Stack>
          <Divider />
          <Typography variant="h6">Detector</Typography>
          <Autocomplete
            value={config.detector}
            size="small"
            disablePortal
            id="combo-box-demo"
            options={Object.keys(detectorList)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="choose detector type" />
            )}
            onChange={(_, value) => {
              value ? handleDetectorChange(value) : {};
            }}
          />
          <Typography>
            Resolution: {detectorList[config.detector].resolution.height} x{" "}
            {detectorList[config.detector].resolution.width}
          </Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>
              Pixel size: {detectorList[config.detector].pixel_size} x{" "}
              {detectorList[config.detector].pixel_size}{" "}
            </Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.pixelSizeUnits}
                label="units"
                onChange={(event: SelectChangeEvent) =>
                  dispatch(
                    editUnits({
                      pixelSizeUnits: event.target.value as DistanceUnits,
                    }),
                  )
                }
              >
                <MenuItem value={DistanceUnits.millimetre}>
                  {DistanceUnits.millimetre}x{DistanceUnits.millimetre}
                </MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {DistanceUnits.micrometre}x{DistanceUnits.micrometre}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider />
          <Stack>
            <Typography variant="h6">Beamstop</Typography>
            <Stack direction={"row"}>
              <Typography flexGrow={2}>
                Diameter: {config.beamstop.diameter}
              </Typography>
              <FormControl>
                <InputLabel>units</InputLabel>
                <Select
                  size="small"
                  value={units.beamstopDiameterUnits}
                  label="units"
                  onChange={(event) =>
                    dispatch(
                      editUnits({
                        beamstopDiameterUnits: event.target
                          .value as DistanceUnits,
                      }),
                    )
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
          </Stack>
          <Divider />
          <Typography variant="h6">Position</Typography>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>
              x: {config.beamstop.centre.x} px
            </Typography>
            <Button size="small">Centre detector</Button>
          </Stack>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>
              y: {config.beamstop.centre.y} px
            </Typography>
            <Button size="small">Centre top edge</Button>
          </Stack>
          <Divider />
          <Typography variant="h6">Clearance</Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Diameter: {config.clearance}</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.clearanceDiameterUnits}
                label="units"
                onChange={(event) =>
                  dispatch(
                    editUnits({
                      clearanceDiameterUnits: event.target
                        .value as DistanceUnits,
                    }),
                  )
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
          <Divider />
          <Typography variant="h6">Camera Tube</Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>
              Diameter: {config.cameraTube.diameter}
            </Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.cameraDiameterUnits}
                label="units"
                onChange={(event) =>
                  dispatch(
                    editUnits({
                      cameraDiameterUnits: event.target.value as DistanceUnits,
                    }),
                  )
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
          <Typography variant="h6">Position</Typography>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>
              x: {config.cameraTube.centre.x} px
            </Typography>
          </Stack>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>
              y: {config.cameraTube.centre.y} px
            </Typography>
          </Stack>
          <Divider />
          <Typography variant="h6">Beam properties</Typography>
          <Stack direction={"row"}>
            <Typography flexGrow={1}>Energy: </Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.beamEnergyUnits}
                label="units"
                onChange={(event) =>
                  dispatch(
                    editUnits({
                      beamEnergyUnits: event.target.value as EnergyUnits,
                    }),
                  )
                }
              >
                <MenuItem value={EnergyUnits.electronVolts}>
                  {EnergyUnits.electronVolts}
                </MenuItem>
                <MenuItem value={EnergyUnits.kiloElectronVolts}>
                  {EnergyUnits.kiloElectronVolts}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"row"}>
            <Typography flexGrow={1}>WaveLength</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.wavelengthUnits}
                label="units"
                onChange={(event) =>
                  dispatch(
                    editUnits({
                      wavelengthUnits: event.target.value as WavelengthUnits,
                    }),
                  )
                }
              >
                <MenuItem value={WavelengthUnits.nanmometres}>
                  {WavelengthUnits.nanmometres}
                </MenuItem>
                <MenuItem value={WavelengthUnits.angstroms}>
                  {WavelengthUnits.angstroms}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Typography>
            Minimum allowed wavelength: {config.minWavelength}{" "}
          </Typography>
          <Typography>
            Maximum allowed wavelength: {config.maxWavelength}
          </Typography>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Typography>Camera Length: </Typography>
            <ButtonGroup>
              <Input size="small" value={config.cameraLength} />
              <Button size="small">
                <RemoveIcon fontSize="small" />
              </Button>
              <Button size="small">
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
            <Typography>m</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Typography flexGrow={2}>Angle:</Typography>
            <Input
              size="small"
              value={config.angle}
              onChange={(event) =>
                dispatch(editConfig({ angle: parseFloat(event.target.value) }))
              }
            />
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                size="small"
                value={units.angleUnits}
                label="units"
                onChange={(event: SelectChangeEvent) =>
                  dispatch(
                    editUnits({ angleUnits: event.target.value as AngleUnits }),
                  )
                }
              >
                <MenuItem value={AngleUnits.radians}>
                  {AngleUnits.radians}
                </MenuItem>
                <MenuItem value={AngleUnits.degrees}>
                  {AngleUnits.degrees}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
