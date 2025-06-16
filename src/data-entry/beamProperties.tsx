import {
  Stack,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Divider,
  InputAdornment,
  Card,
} from "@mui/material";
import {
  AngleUnits,
  EnergyUnits,
  WavelengthUnits,
  wavelength2EnergyConverter,
  energy2WavelengthConverter,
  parseNumericInput,
  AngstromSymbol,
} from "../utils/units";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import { unit } from "mathjs";

// todo consider splitting this into components
/**
 * Component with data entry inputs for the Beamline.
 * @returns
 */
export default function BeampropertiesDataEntry() {
  const beamlineConfigStore = useBeamlineConfigStore();

  const handleAngleUnits = (event: SelectChangeEvent<AngleUnits>) => {
    beamlineConfigStore.updateAngleUnits(event.target.value as AngleUnits);
  };
  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfigStore.updateAngle(
      parseNumericInput(event.target.value),
      beamlineConfigStore.beamline.angle.formatUnits() as AngleUnits,
    );
  };

  const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWavelength = parseNumericInput(event.target.value);
    beamlineConfigStore.updateWavelength(
      newWavelength,
      beamlineConfigStore.beamline.wavelength.formatUnits() as WavelengthUnits,
    );
    const newEnergy = wavelength2EnergyConverter(
      unit(
        newWavelength ?? NaN,
        beamlineConfigStore.beamline.wavelength.formatUnits(),
      ),
    );
    beamlineConfigStore.updateEnergy(
      parseFloat(
        newEnergy
          .to(beamlineConfigStore.energy.formatUnits())
          .toNumber()
          .toPrecision(4),
      ),
      beamlineConfigStore.energy.formatUnits() as EnergyUnits,
    );
  };

  const handleWavelengthUnits = (event: SelectChangeEvent<WavelengthUnits>) => {
    beamlineConfigStore.updateWavelengthUnits(
      event.target.value as WavelengthUnits,
    );
  };

  const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnergy = parseNumericInput(event.target.value);
    beamlineConfigStore.updateEnergy(
      newEnergy,
      beamlineConfigStore.energy.formatUnits() as EnergyUnits,
    );
    const newWavelength = energy2WavelengthConverter(
      unit(newEnergy ?? NaN, beamlineConfigStore.energy.formatUnits()),
    );
    beamlineConfigStore.updateWavelength(
      parseFloat(
        newWavelength
          .to(beamlineConfigStore.beamline.wavelength.formatUnits())
          .toNumber()
          .toPrecision(4),
      ),
      beamlineConfigStore.beamline.wavelength.formatUnits() as WavelengthUnits,
    );
  };

  const handleEnergyUnits = (event: SelectChangeEvent<EnergyUnits>) => {
    beamlineConfigStore.updateEnergyUnits(event.target.value as EnergyUnits);
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfigStore.updateCameraLength(
      parseNumericInput(event.target.value),
    );
  };

  return (
    <Card sx={{ p: 2 }} variant="outlined">
      <Stack spacing={2}>
        <Typography variant="h6">Beam properties</Typography>
        <Divider />
        {/* ENERGY */}
        <Stack direction={"row"} spacing={1}>
          <TextField
            type="number"
            size="small"
            label="energy"
            value={beamlineConfigStore.userEnergy}
            onChange={handleEnergy}
          />
          <FormControl>
            <InputLabel>units</InputLabel>
            <Select
              size="small"
              label="units"
              value={beamlineConfigStore.energy.formatUnits() as EnergyUnits}
              onChange={handleEnergyUnits}
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
        {/* WAVELENGTH */}
        <Stack direction={"row"} spacing={1}>
          <TextField
            type="number"
            size="small"
            label="wavelength"
            value={beamlineConfigStore.userWavelength}
            onChange={handleWavelength}
          />
          <FormControl>
            <InputLabel>units</InputLabel>
            <Select
              size="small"
              label="units"
              value={
                beamlineConfigStore.beamline.wavelength.formatUnits() as WavelengthUnits
              }
              onChange={handleWavelengthUnits}
            >
              <MenuItem value={WavelengthUnits.nanometres}>
                {WavelengthUnits.nanometres}
              </MenuItem>
              <MenuItem value={WavelengthUnits.angstroms}>
                {AngstromSymbol}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Typography>
          Minimum allowed wavelength:
          {" " + beamlineConfigStore.beamline.wavelengthLimits.min.toString()}
        </Typography>
        <Typography>
          Maximum allowed wavelength:
          {" " + beamlineConfigStore.beamline.wavelengthLimits.max.toString()}
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            type="number"
            size="small"
            label="camera length"
            value={beamlineConfigStore.beamline.cameraLength ?? ""}
            InputProps={{
              inputProps: {
                max: beamlineConfigStore.beamline.cameraLimits.max.toNumber(),
                min: beamlineConfigStore.beamline.cameraLimits.min.toNumber(),
                step: beamlineConfigStore.beamline.cameraLimits.step.toNumber(),
              },
              endAdornment: <InputAdornment position="end">m</InputAdornment>,
            }}
            onChange={handleCameraLength}
          />
        </Stack>
        {/* ANGLE */}
        <Stack direction="row" spacing={1}>
          <TextField
            type="number"
            size="small"
            label="angle"
            defaultValue={""}
            value={beamlineConfigStore.userAngle ?? ""}
            onChange={handleAngle}
          />
          <FormControl>
            <InputLabel>units</InputLabel>
            <Select
              size="small"
              label="units"
              value={
                beamlineConfigStore.beamline.angle.formatUnits() as AngleUnits
              }
              onChange={handleAngleUnits}
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
    </Card>
  );
}
