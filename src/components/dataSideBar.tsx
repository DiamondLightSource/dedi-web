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
import { BeamlineConfig, DetectorType } from "../utils/types";
import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

enum DistanceUnits {
  millimetre = "millimetre",
  micrometre = "micrometre",
}

enum EnergyUnits {
  electronVolts = "electronVolts",
  kiloElectronVolts = "kiloElectronVolts",
}

enum WavelengthUnits {
  nanmometres = "nanometeres",
  angstroms = "angstroms",
}

enum AngleUnits {
  radians = "radians",
  degrees = "degrees",
}

export default function DataSideBar(): JSX.Element {
  const [cameraDiameterUnits, setCameraDiameterUnits] =
    React.useState<DistanceUnits>(DistanceUnits.millimetre);

  const handleCameraDiameterUnits = (event: SelectChangeEvent) => {
    setCameraDiameterUnits(event.target.value as DistanceUnits);
  };

  const [clearanceDiameterUnits, setClearnaceDiameterUnits] =
    React.useState<DistanceUnits>(DistanceUnits.millimetre);

  const handleClearanceDiameterUnits = (event: SelectChangeEvent) => {
    setClearnaceDiameterUnits(event.target.value as DistanceUnits);
  };

  const [beamstopDiameterUnits, setBeamstopDiameterUnits] =
    React.useState<DistanceUnits>(DistanceUnits.millimetre);

  const handleBeamstopDiameterUnits = (event: SelectChangeEvent) => {
    setBeamstopDiameterUnits(event.target.value as DistanceUnits);
  };
  const [pixelSizeUnits, setPixelSizeUnits] = React.useState<DistanceUnits>(
    DistanceUnits.millimetre,
  );

  const handlePixelSizeUnits = (event: SelectChangeEvent) => {
    setPixelSizeUnits(event.target.value as DistanceUnits);
  };
  const [beamEnergyUnits, setBeamEnergyUnits] = React.useState<EnergyUnits>(
    EnergyUnits.electronVolts,
  );

  const handleBeamEnergyUnits = (event: SelectChangeEvent) => {
    setBeamEnergyUnits(event.target.value as EnergyUnits);
  };

  const [wavelengthUnits, setWavelengthUnits] = React.useState<WavelengthUnits>(
    WavelengthUnits.nanmometres,
  );

  const handleWavelengthUnits = (event: SelectChangeEvent) => {
    setWavelengthUnits(event.target.value as WavelengthUnits);
  };

  const [cameraLength, setCameraLength] = React.useState<number>(1.9);

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCameraLength(parseFloat(event.target.value));
  };
  const [angleUnits, setAngleUnits] = React.useState<AngleUnits>(
    AngleUnits.radians,
  );

  const handleAngleUnits = (event: SelectChangeEvent) => {
    setAngleUnits(event.target.value as AngleUnits);
  };

  const [angle, setAngle] = React.useState<number>(90);

  const handleAngleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAngle(parseFloat(event.target.value));
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
              disablePortal
              id="combo-box-demo"
              options={Object.values(BeamlineConfig)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="choose beamline config" />
              )}
            />
          </Stack>
          <Divider />
          <Typography variant="h6">Detector</Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={Object.values(DetectorType)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="choose detector type" />
            )}
          />
          <Typography>Resolution: 150x160</Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Pixel size</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={pixelSizeUnits}
                label="units"
                onChange={handlePixelSizeUnits}
              >
                <MenuItem value={DistanceUnits.millimetre}>mm x mm</MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {"\u03bcm x \u03bcm"}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider />
          <Stack>
            <Typography variant="h6">Beamstop</Typography>
            <Stack direction={"row"}>
              <Typography flexGrow={2}>Diameter: {4}</Typography>
              <FormControl>
                <InputLabel>units</InputLabel>
                <Select
                  value={beamstopDiameterUnits}
                  label="units"
                  onChange={handleBeamstopDiameterUnits}
                >
                  <MenuItem value={DistanceUnits.millimetre}>mm</MenuItem>
                  <MenuItem value={DistanceUnits.micrometre}>
                    {"\u03bcm"}
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Divider />
          <Stack>
            <Typography variant="h6">Position</Typography>
            <Stack direction={"row"}>
              <Typography flexGrow={2}>x:</Typography>
              <Typography flexGrow={2}>px</Typography>
            </Stack>
            <Stack direction={"row"}>
              <Typography flexGrow={2}>y:</Typography>
              <Typography flexGrow={2}>px</Typography>
            </Stack>
            <Button>Centre detector</Button>
            <Button>Centre top edge</Button>
          </Stack>
          <Divider />
          <Typography variant="h6">Clearance</Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Diameter: {4}</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={clearanceDiameterUnits}
                label="units"
                onChange={handleClearanceDiameterUnits}
              >
                <MenuItem value={DistanceUnits.millimetre}>mm</MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {"\u03bcm"}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Divider />
          <Typography variant="h6">Camera Tube</Typography>
          <Stack direction="row">
            <Typography flexGrow={2}>Diameter: {4}</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={cameraDiameterUnits}
                label="units"
                onChange={handleCameraDiameterUnits}
              >
                <MenuItem value={DistanceUnits.millimetre}>mm</MenuItem>
                <MenuItem value={DistanceUnits.micrometre}>
                  {"\u03bcm"}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="h6">Position</Typography>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>x:</Typography>
            <Typography flexGrow={2}>px</Typography>
          </Stack>
          <Stack direction={"row"}>
            <Typography flexGrow={2}>y:</Typography>
            <Typography flexGrow={2}>px</Typography>
          </Stack>
          <Divider />
          <Typography variant="h6">Beam properties</Typography>
          <Stack direction={"row"}>
            <Typography flexGrow={1}>Energy</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={beamEnergyUnits}
                label="units"
                onChange={handleBeamEnergyUnits}
              >
                <MenuItem value={EnergyUnits.electronVolts}>eV</MenuItem>
                <MenuItem value={EnergyUnits.kiloElectronVolts}>keV</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"row"}>
            <Typography flexGrow={1}>WaveLength</Typography>
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={wavelengthUnits}
                label="units"
                onChange={handleWavelengthUnits}
              >
                <MenuItem value={WavelengthUnits.nanmometres}>nm</MenuItem>
                <MenuItem value={WavelengthUnits.angstroms}>
                  {"\u212B"}
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Typography>Minimum allowed wavelength: {4}</Typography>
          <Typography>Maximum allowed wavelength: {4}</Typography>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Typography>Camera Length: </Typography>
            <ButtonGroup>
              <Input
                size="small"
                onChange={handleCameraLength}
                value={cameraLength}
              />
              <Button
                onClick={() =>
                  setCameraLength(Math.round((cameraLength - 2.5) * 100) / 100)
                }
              >
                <RemoveIcon fontSize="small" />
              </Button>
              <Button
                onClick={() =>
                  setCameraLength(Math.round((cameraLength + 2.5) * 100) / 100)
                }
              >
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
            <Typography>m</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={2}>
            <Typography flexGrow={2}>Angle:</Typography>
            <Input size="small" onChange={handleAngleChange} value={angle} />
            <FormControl>
              <InputLabel>units</InputLabel>
              <Select
                value={angleUnits}
                label="units"
                onChange={handleAngleUnits}
              >
                <MenuItem value={AngleUnits.radians}>rad</MenuItem>
                <MenuItem value={AngleUnits.degrees}>deg</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
