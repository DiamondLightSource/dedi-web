import {
  Stack,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import {
  AngleUnits,
  EnergyUnits,
  WavelengthUnits,
  angstroms2Nanometres,
  nanometres2Angstroms,
  kiloElectronVolts2ElectronVots,
  electronVots2KiloElectronVolts,
  wavelength2EnergyConverter,
  energy2WavelengthConverter,
  parseNumericInput,
} from "../utils/units";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import { MathUtils } from "three/src/Three.js";

export default function BeampropertiesDataEntry() {
  const beamlineConfig = useBeamlineConfigStore();

  const minWavelength = useBeamlineConfigStore((state) => {
    if (state.wavelengthUnits === WavelengthUnits.angstroms) {
      return nanometres2Angstroms(state.minWavelength);
    }
    return state.minWavelength;
  });

  const maxWavelength = useBeamlineConfigStore((state) => {
    if (state.wavelengthUnits === WavelengthUnits.angstroms) {
      return nanometres2Angstroms(state.maxWavelength);
    }
    return state.maxWavelength;
  });

  const handleAngleUnits = (event: SelectChangeEvent<AngleUnits>) => {
    const newUnits = event.target.value as AngleUnits;
    let newAngle = beamlineConfig.angle;

    if (
      newAngle !== null &&
      newUnits === AngleUnits.degrees &&
      beamlineConfig.angleUnits === AngleUnits.radians
    ) {
      newAngle = MathUtils.radToDeg(newAngle);
    } else if (
      newAngle !== null &&
      newUnits === AngleUnits.radians &&
      beamlineConfig.angleUnits === AngleUnits.degrees
    ) {
      newAngle = MathUtils.degToRad(newAngle);
    }
    beamlineConfig.update({
      angle: newAngle,
      angleUnits: newUnits,
    });
  };

  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfig.update({ angle: parseNumericInput(event.target.value) });
  };

  const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWavelength = parseNumericInput(event.target.value);
    let newEnergy: number | null = null;

    if (newWavelength === null) {
      beamlineConfig.update({
        energy: newEnergy,
        wavelength: newWavelength,
      });
      return;
    }

    // account for wavelength units
    if (beamlineConfig.wavelengthUnits === WavelengthUnits.angstroms) {
      newEnergy = wavelength2EnergyConverter(
        angstroms2Nanometres(newWavelength),
      );
    } else {
      newEnergy = wavelength2EnergyConverter(newWavelength);
    }

    // account for energy units
    if (beamlineConfig.beamEnergyUnits === EnergyUnits.electronVolts) {
      newEnergy = electronVots2KiloElectronVolts(newEnergy);
    }

    beamlineConfig.update({
      energy: newEnergy,
      wavelength: newWavelength,
    });
  };

  const handleWavelengthUnits = (event: SelectChangeEvent<WavelengthUnits>) => {
    const newUnits = event.target.value as WavelengthUnits;
    let newWavelength = beamlineConfig.wavelength;
    if (
      newWavelength !== null &&
      newUnits === WavelengthUnits.angstroms &&
      beamlineConfig.wavelengthUnits === WavelengthUnits.nanmometres
    ) {
      newWavelength = nanometres2Angstroms(newWavelength);
    } else if (
      newWavelength !== null &&
      newUnits === WavelengthUnits.nanmometres &&
      beamlineConfig.wavelengthUnits === WavelengthUnits.angstroms
    ) {
      newWavelength = angstroms2Nanometres(newWavelength);
    }
    beamlineConfig.update({
      wavelength: newWavelength,
      wavelengthUnits: newUnits,
    });
  };

  const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnergy = parseNumericInput(event.target.value);
    let newWavelength: number | null = null;

    if (newEnergy === null) {
      beamlineConfig.update({
        energy: newEnergy,
        wavelength: newWavelength,
      });
      return;
    }

    if (beamlineConfig.beamEnergyUnits === EnergyUnits.electronVolts) {
      newWavelength = energy2WavelengthConverter(
        electronVots2KiloElectronVolts(newEnergy),
      );
    } else {
      newWavelength = energy2WavelengthConverter(newEnergy);
    }

    if (beamlineConfig.wavelengthUnits === WavelengthUnits.angstroms) {
      newWavelength = angstroms2Nanometres(newWavelength);
    }

    beamlineConfig.update({
      energy: newEnergy,
      wavelength: newWavelength,
    });
  };

  const handleEnergyUnits = (event: SelectChangeEvent<EnergyUnits>) => {
    const newUnits = event.target.value as EnergyUnits;
    let newEnergy = beamlineConfig.energy;
    if (
      newEnergy !== null &&
      newUnits === EnergyUnits.electronVolts &&
      beamlineConfig.beamEnergyUnits === EnergyUnits.kiloElectronVolts
    ) {
      newEnergy = kiloElectronVolts2ElectronVots(newEnergy);
    } else if (
      newEnergy != null &&
      newUnits === EnergyUnits.kiloElectronVolts &&
      beamlineConfig.beamEnergyUnits === EnergyUnits.electronVolts
    ) {
      newEnergy = electronVots2KiloElectronVolts(newEnergy);
    }
    beamlineConfig.update({
      energy: newEnergy,
      beamEnergyUnits: event.target.value as EnergyUnits,
    });
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfig.update({
      cameraLength: parseNumericInput(event.target.value),
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Beam properties</Typography>
      <Stack direction={"row"} spacing={1}>
        <Typography flexGrow={1}>Energy: </Typography>
        <TextField
          type="number"
          size="small"
          value={beamlineConfig.energy}
          onChange={handleEnergy}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={beamlineConfig.beamEnergyUnits}
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
      <Stack direction={"row"} spacing={1}>
        <Typography flexGrow={1}>Wavelength: </Typography>
        <TextField
          type="number"
          size="small"
          value={beamlineConfig.wavelength}
          onChange={handleWavelength}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={beamlineConfig.wavelengthUnits}
            onChange={handleWavelengthUnits}
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
        Minimum allowed wavelength: {minWavelength}{" "}
        {beamlineConfig.wavelengthUnits}{" "}
      </Typography>
      <Typography>
        Maximum allowed wavelength: {maxWavelength}{" "}
        {beamlineConfig.wavelengthUnits}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Typography>Camera Length: </Typography>
        <TextField
          type="number"
          size="small"
          value={beamlineConfig.cameraLength}
          InputProps={{
            inputProps: {
              max: beamlineConfig.maxCameraLength,
              min: beamlineConfig.minCameraLength,
              step: beamlineConfig.cameraLengthStep,
            },
          }}
          onChange={handleCameraLength}
        />
        <Typography>m</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Typography flexGrow={2}>Angle:</Typography>
        <TextField
          type="number"
          size="small"
          defaultValue={""}
          value={beamlineConfig.angle ?? ""}
          onChange={handleAngle}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={beamlineConfig.angleUnits}
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
