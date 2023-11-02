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

  const cameraLength = useBeamlineConfigStore((state) => state.cameraLength);
  const minCameraLength = useBeamlineConfigStore(
    (state) => state.minCameraLength,
  );
  const maxCameraLength = useBeamlineConfigStore(
    (state) => state.maxCameraLength,
  );

  const energy = useBeamlineConfigStore((state) => state.energy);
  const energyUnits = useBeamlineConfigStore((state) => state.beamEnergyUnits);

  const updateConfig = useBeamlineConfigStore((state) => state.update);

  const angle = useBeamlineConfigStore((state) => state.angle);
  const angleUnits = useBeamlineConfigStore((state) => state.angleUnits);

  const handleAngleUnits = (event: SelectChangeEvent<AngleUnits>) => {
    const newUnits = event.target.value as AngleUnits;
    let newAngle = angle;

    if (
      newAngle !== null &&
      newUnits === AngleUnits.degrees &&
      angleUnits === AngleUnits.radians
    ) {
      newAngle = MathUtils.radToDeg(newAngle);
    } else if (
      newAngle !== null &&
      newUnits === AngleUnits.radians &&
      angleUnits === AngleUnits.degrees
    ) {
      newAngle = MathUtils.degToRad(newAngle);
    }
    updateConfig({
      angle: newAngle,
      angleUnits: newUnits,
    });
  };

  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ angle: parseNumericInput(event.target.value) });
  };

  const wavelength = useBeamlineConfigStore((state) => state.wavelength);
  const wavelengthUnits = useBeamlineConfigStore(
    (state) => state.wavelengthUnits,
  );

  const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newWavelength = parseNumericInput(event.target.value);
    let newEnergy: number | null = null;

    if (newWavelength === null) {
      updateConfig({
        energy: newEnergy,
        wavelength: newWavelength,
      });
      return;
    }

    // account for wavelength units
    if (wavelengthUnits === WavelengthUnits.angstroms) {
      newEnergy = wavelength2EnergyConverter(
        angstroms2Nanometres(newWavelength),
      );
    } else {
      newEnergy = wavelength2EnergyConverter(newWavelength);
    }

    // account for energy units
    if (energyUnits === EnergyUnits.electronVolts) {
      newEnergy = electronVots2KiloElectronVolts(newEnergy);
    }

    updateConfig({
      energy: newEnergy,
      wavelength: newWavelength,
    });
  };

  const handleWavelengthUnits = (event: SelectChangeEvent<WavelengthUnits>) => {
    const newUnits = event.target.value as WavelengthUnits;
    let newWavelength = wavelength;
    if (
      newWavelength !== null &&
      newUnits === WavelengthUnits.angstroms &&
      wavelengthUnits === WavelengthUnits.nanmometres
    ) {
      newWavelength = nanometres2Angstroms(newWavelength);
    } else if (
      newWavelength !== null &&
      newUnits === WavelengthUnits.nanmometres &&
      wavelengthUnits === WavelengthUnits.angstroms
    ) {
      newWavelength = angstroms2Nanometres(newWavelength);
    }
    updateConfig({
      wavelength: newWavelength,
      wavelengthUnits: newUnits,
    });
  };

  const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEnergy = parseNumericInput(event.target.value);
    let newWavelength: number | null = null;

    if (newEnergy === null) {
      updateConfig({
        energy: newEnergy,
        wavelength: newWavelength,
      });
      return;
    }

    if (energyUnits === EnergyUnits.electronVolts) {
      newWavelength = energy2WavelengthConverter(
        electronVots2KiloElectronVolts(newEnergy),
      );
    } else {
      newWavelength = energy2WavelengthConverter(newEnergy);
    }

    if (wavelengthUnits === WavelengthUnits.angstroms) {
      newWavelength = angstroms2Nanometres(newWavelength);
    }

    updateConfig({
      energy: newEnergy,
      wavelength: newWavelength,
    });
  };

  const handleEnergyUnits = (event: SelectChangeEvent<EnergyUnits>) => {
    const newUnits = event.target.value as EnergyUnits;
    let newEnergy = energy;
    if (
      newEnergy !== null &&
      newUnits === EnergyUnits.electronVolts &&
      energyUnits === EnergyUnits.kiloElectronVolts
    ) {
      newEnergy = kiloElectronVolts2ElectronVots(newEnergy);
    } else if (
      newEnergy != null &&
      newUnits === EnergyUnits.kiloElectronVolts &&
      energyUnits === EnergyUnits.electronVolts
    ) {
      newEnergy = electronVots2KiloElectronVolts(newEnergy);
    }
    updateConfig({
      energy: newEnergy,
      beamEnergyUnits: event.target.value as EnergyUnits,
    });
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      cameraLength: parseNumericInput(event.target.value),
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Beam properties</Typography>
      <Stack direction={"row"} spacing={2}>
        <Typography flexGrow={1}>Energy: </Typography>
        <TextField
          type="number"
          size="small"
          value={energy}
          onChange={handleEnergy}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={energyUnits}
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
      <Stack direction={"row"} spacing={2}>
        <Typography flexGrow={1}>Wavelength: </Typography>
        <TextField
          type="number"
          size="small"
          value={wavelength}
          onChange={handleWavelength}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={wavelengthUnits}
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
        Minimum allowed wavelength: {minWavelength} {wavelengthUnits}{" "}
      </Typography>
      <Typography>
        Maximum allowed wavelength: {maxWavelength} {wavelengthUnits}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Typography>Camera Length: </Typography>
        <TextField
          type="number"
          size="small"
          value={cameraLength}
          InputProps={{
            inputProps: {
              max: maxCameraLength,
              min: minCameraLength,
            },
          }}
          onChange={handleCameraLength}
        />
        <Typography>m</Typography>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Typography flexGrow={2}>Angle:</Typography>
        <TextField
          type="number"
          size="small"
          defaultValue={""}
          value={angle ?? ""}
          onChange={handleAngle}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={angleUnits}
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
