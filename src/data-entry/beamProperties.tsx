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
  const beamlineConfig = useBeamlineConfigStore();

  const handleAngleUnits = (event: SelectChangeEvent<AngleUnits>) => {
    beamlineConfig.updateAngleUnits(event.target.value as AngleUnits);
  };
  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfig.updateAngle(
      parseNumericInput(event.target.value),
      beamlineConfig.beamline.angle.formatUnits() as AngleUnits,
    );
  };

  const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWavelength = parseNumericInput(event.target.value);
    beamlineConfig.updateWavelength(
      newWavelength,
      beamlineConfig.beamline.wavelength.formatUnits() as WavelengthUnits,
    );
    const newEnergy = wavelength2EnergyConverter(
      unit(
        newWavelength ?? NaN,
        beamlineConfig.beamline.wavelength.formatUnits(),
      ),
    );
    beamlineConfig.updateEnergy(
      parseFloat(
        newEnergy
          .to(beamlineConfig.energy.formatUnits())
          .toNumber()
          .toPrecision(4),
      ),
      beamlineConfig.energy.formatUnits() as EnergyUnits,
    );
  };

  const handleWavelengthUnits = (event: SelectChangeEvent<WavelengthUnits>) => {
    beamlineConfig.updateWavelengthUnits(event.target.value as WavelengthUnits);
  };

  const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnergy = parseNumericInput(event.target.value);
    beamlineConfig.updateEnergy(
      newEnergy,
      beamlineConfig.energy.formatUnits() as EnergyUnits,
    );
    const newWavelength = energy2WavelengthConverter(
      unit(newEnergy ?? NaN, beamlineConfig.energy.formatUnits()),
    );
    beamlineConfig.updateWavelength(
      parseFloat(
        newWavelength
          .to(beamlineConfig.beamline.wavelength.formatUnits())
          .toNumber()
          .toPrecision(4),
      ),
      beamlineConfig.beamline.wavelength.formatUnits() as WavelengthUnits,
    );
  };

  const handleEnergyUnits = (event: SelectChangeEvent<EnergyUnits>) => {
    beamlineConfig.updateEnergyUnits(event.target.value as EnergyUnits);
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfig.updateCameraLength(parseNumericInput(event.target.value));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Beam properties</Typography>
      <Divider />
      {/* ENERGY */}
      <Stack direction={"row"} spacing={1}>
        <TextField
          type="number"
          size="small"
          label="energy"
          value={beamlineConfig.userEnergy}
          onChange={handleEnergy}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={beamlineConfig.energy.formatUnits() as EnergyUnits}
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
          value={beamlineConfig.userWavelength}
          onChange={handleWavelength}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={
              // eslint-disable-next-line max-len
              beamlineConfig.beamline.wavelength.formatUnits() as WavelengthUnits
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
        {" " + beamlineConfig.beamline.wavelengthLimits.min.toString()}
      </Typography>
      <Typography>
        Maximum allowed wavelength:
        {" " + beamlineConfig.beamline.wavelengthLimits.max.toString()}
      </Typography>
      <Stack direction="row" spacing={1} >
        <TextField
          type="number"
          size="small"
          label="camera length"
          value={beamlineConfig.beamline.cameraLength ?? ""}
          InputProps={{
            inputProps: {
              max: beamlineConfig.beamline.cameraLimits.max.toNumber(),
              min: beamlineConfig.beamline.cameraLimits.min.toNumber(),
              step: beamlineConfig.beamline.cameraLimits.step.toNumber(),
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
          value={beamlineConfig.userAngle ?? ""}
          onChange={handleAngle}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={beamlineConfig.beamline.angle.formatUnits() as AngleUnits}
            onChange={handleAngleUnits}
          >
            <MenuItem value={AngleUnits.radians}>{AngleUnits.radians}</MenuItem>
            <MenuItem value={AngleUnits.degrees}>{AngleUnits.degrees}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
