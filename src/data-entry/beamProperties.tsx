import {
  Stack,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
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

  const energy = useBeamlineConfigStore((state) => {
    if (!state.energy) {
      return null;
    }

    if (state.beamEnergyUnits === EnergyUnits.electronVolts) {
      return kiloElectronVolts2ElectronVots(
        state.energy,
      );
    }
    return state.energy;
  });
  const energyUnits = useBeamlineConfigStore((state) => state.beamEnergyUnits);

  const updateConfig = useBeamlineConfigStore((state) => state.update);

  const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (energyUnits === EnergyUnits.electronVolts && event.target.value) {
      updateConfig({
        energy: electronVots2KiloElectronVolts(parseFloat(event.target.value)),
        wavelength: energy2WavelengthConverter(
          electronVots2KiloElectronVolts(parseFloat(event.target.value)),
        ),
      });
    } else {
      updateConfig({
        energy: parseFloat(event.target.value),
        wavelength: energy2WavelengthConverter(parseFloat(event.target.value)),
      });
    }
  };

  const angle = useBeamlineConfigStore((state) => {
    if (state.angle && state.angleUnits === AngleUnits.degrees) {
      return MathUtils.radToDeg(state.angle);
    }
    return state.angle;
  });
  const angleUnits = useBeamlineConfigStore((state) => state.angleUnits);
  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (angleUnits === AngleUnits.degrees && event.target.value) {
      updateConfig({
        angle: MathUtils.degToRad(parseFloat(event.target.value)),
      });
    } else {
      updateConfig({ angle: parseFloat(event.target.value) });
    }
  };

  const wavelength = useBeamlineConfigStore((state) => {
    if (
      state.wavelength &&
      state.wavelengthUnits === WavelengthUnits.angstroms
    ) {
      return nanometres2Angstroms(state.wavelength);
    }
    return state.wavelength;
  });

  const wavelengthUnits = useBeamlineConfigStore(
    (state) => state.wavelengthUnits,
  );
  const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (wavelengthUnits === WavelengthUnits.angstroms && event.target.value) {
      updateConfig({
        energy: wavelength2EnergyConverter(angstroms2Nanometres(parseFloat(event.target.value))),
        wavelength: angstroms2Nanometres(parseFloat(event.target.value)),
      });
    } else {
      updateConfig({ 
        energy: wavelength2EnergyConverter(parseFloat(event.target.value)),
        wavelength: parseFloat(event.target.value) });
    }
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({
      cameraLength: parseFloat(event.target.value)
        ? parseFloat(event.target.value)
        : null,
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
          value={energy ?? ""}
          onChange={handleEnergy}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={energyUnits}
            onChange={(event) =>
              updateConfig({
                beamEnergyUnits: event.target.value as EnergyUnits,
              })
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
      <Stack direction={"row"} spacing={2}>
        <Typography flexGrow={1}>Wavelength: </Typography>
        <TextField
          type="number"
          size="small"
          value={wavelength ?? ""}
          onChange={handleWavelength}
        />
        <FormControl>
          <InputLabel>units</InputLabel>
          <Select
            size="small"
            label="units"
            value={wavelengthUnits}
            onChange={(event) =>
              updateConfig({
                wavelengthUnits: event.target.value as WavelengthUnits,
              })
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
          value={cameraLength ?? ""}
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
            onChange={(event) =>
              updateConfig({ angleUnits: event.target.value as AngleUnits })
            }
          >
            <MenuItem value={AngleUnits.radians}>{AngleUnits.radians}</MenuItem>
            <MenuItem value={AngleUnits.degrees}>{AngleUnits.degrees}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
}
