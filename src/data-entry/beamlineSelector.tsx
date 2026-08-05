import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDetectorStore } from "./detectorStore";
import { useBeamstopStore } from "./beamstopStore";
import { useCameraTubeStore } from "./cameraTubeStore";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import { createAppConfig } from "../presets/presetManager";
import {
  AngleUnits,
  AngstromSymbol,
  EnergyUnits,
  WavelengthUnits,
  energy2WavelengthConverter,
  parseNumericInput,
  wavelength2EnergyConverter,
} from "../utils/units";
import { secondaryButtonSx } from "../utils/styles";
import { sanitizeNumber } from "../utils/types";
import { InfoRow } from "../utils/InfoRow";
import {
  AppConfigTableDialog,
  AddAppConfigDialog,
} from "../dialogs/beamline/appConfigDialog";
import { unit } from "mathjs";
import React, { useState } from "react";

export default function BeamlineSelector(): React.JSX.Element {
  const detectorStore = useDetectorStore();
  const beamlineConfigStore = useBeamlineConfigStore();
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();

  const presetConfigRecord = beamlineConfigStore.presetRecord;
  const [tableOpen, setTableOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const { beamline, energy } = beamlineConfigStore;

  const handlePreset = (name: string) => {
    const appConfig = createAppConfig(presetConfigRecord[name]);
    detectorStore.updateDetector(appConfig.detector);
    beamstopStore.setBeamstop(appConfig.beamstop);
    cameraTubeStore.updateCameraTube(appConfig.cameraTube);
    beamlineConfigStore.updateBeamline(appConfig.beamline);
    beamlineConfigStore.updateWavelengthUnits(WavelengthUnits.nanometres);
    beamlineConfigStore.updateAngleUnits(AngleUnits.degrees);
    const newEnergy = wavelength2EnergyConverter(appConfig.beamline.wavelength);
    beamlineConfigStore.updateEnergy(
      newEnergy.to(EnergyUnits.kiloElectronVolts).toNumber(),
      EnergyUnits.kiloElectronVolts,
    );
    beamlineConfigStore.setCurrentPresetName(name);
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

  const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfigStore.updateAngle(
      parseNumericInput(event.target.value),
      beamlineConfigStore.beamline.angle.formatUnits() as AngleUnits,
    );
  };

  const handleAngleUnits = (event: SelectChangeEvent<AngleUnits>) => {
    beamlineConfigStore.updateAngleUnits(event.target.value as AngleUnits);
  };

  const normalizeCameraLength = (value: number) => {
    // Round input values to valid multiples of step within min/max limits
    const min = beamline.cameraLimits.min.toNumber();
    const max = beamline.cameraLimits.max.toNumber();
    const step = beamline.cameraLimits.step.toNumber();
    const clamped = Math.min(Math.max(value, min), max);
    const rounded = min + Math.round((clamped - min) / step) * step;

    return Math.min(Math.max(rounded, min), max);
  };

  const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamlineConfigStore.updateCameraLength(parseNumericInput(event.target.value));
  };

  const handleCameraLengthBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = parseNumericInput(event.target.value);

    beamlineConfigStore.updateCameraLength(
      normalizeCameraLength(
        value ?? beamline.cameraLimits.min.toNumber()
      )
    );
  };

  return (
    <Card variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
      {/* Header strip */}
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
          Beamline
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Preset selector */}
        <Stack spacing={1}>
          <Autocomplete
            size="small"
            options={Object.keys(presetConfigRecord)}
            value={beamlineConfigStore.currentPresetName}
            renderInput={(params) => (
              <TextField {...params} label="Choose beamline" />
            )}
            onChange={(_, value) => (value ? handlePreset(value) : {})}
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={() => setTableOpen(true)}
            >
              Show all beamlines
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={() => setAddOpen(true)}
            >
              Add beamline
            </Button>
          </Stack>
        </Stack>

        {/* Energy */}
        <InfoRow label="Energy">
          <TextField
            type="number"
            size="small"
            label="Energy"
            value={sanitizeNumber(beamlineConfigStore.userEnergy)}
            onChange={handleEnergy}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small">
            <InputLabel>units</InputLabel>
            <Select
              label="units"
              value={energy.formatUnits() as EnergyUnits}
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
        </InfoRow>

        {/* Wavelength */}
        <InfoRow label="Wavelength">
          <TextField
            type="number"
            size="small"
            label="Wavelength"
            value={sanitizeNumber(beamlineConfigStore.userWavelength)}
            onChange={handleWavelength}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small">
            <InputLabel>units</InputLabel>
            <Select
              label="units"
              value={beamline.wavelength.formatUnits() as WavelengthUnits}
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
        </InfoRow>

        {/* Wavelength limits */}
        <Stack spacing={0.5}>
          <InfoRow label="λ min">
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {beamline.wavelengthLimits.min
                .to(beamline.wavelength.formatUnits())
                .toString()}
            </Typography>
          </InfoRow>
          <InfoRow label="λ max">
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {beamline.wavelengthLimits.max
                .to(beamline.wavelength.formatUnits())
                .toString()}
            </Typography>
          </InfoRow>
        </Stack>

        {/* Camera length */}
          <Stack>
            <InfoRow label="Camera Length">
              <TextField
              type="number"
              size="small"
              value={sanitizeNumber(beamline.cameraLength) ?? beamline.cameraLimits.min.toNumber()}
              onChange={handleCameraLength}
              onBlur={handleCameraLengthBlur}
              sx={{ width: 150 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">m</InputAdornment>
                  ),
                },
                htmlInput: {
                  min: beamline.cameraLimits.min.toNumber(),
                  max: beamline.cameraLimits.max.toNumber(),
                  step: beamline.cameraLimits.step.toNumber(),
                }
              }}
              />
            </InfoRow>
            <Slider
            min={beamline.cameraLimits.min.toNumber()}
            max={beamline.cameraLimits.max.toNumber()}
            step={beamline.cameraLimits.step.toNumber()}
            value={beamline.cameraLength ?? beamline.cameraLimits.min.toNumber()}
            onChange={(_: Event, value: number | number[]) =>
              beamlineConfigStore.updateCameraLength(value as number)
            }
            valueLabelDisplay="auto"
            valueLabelFormat={(v: number) => `${v} m`}
            />
          </Stack>

        {/* Angle */}
        <InfoRow label="Angle">
          <TextField
            type="number"
            size="small"
            label="Angle"
            value={sanitizeNumber(beamlineConfigStore.userAngle)}
            onChange={handleAngle}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small">
            <InputLabel>units</InputLabel>
            <Select
              label="units"
              value={beamline.angle.formatUnits() as AngleUnits}
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
        </InfoRow>
      </Stack>

      <AppConfigTableDialog
        open={tableOpen}
        handleClose={() => setTableOpen(false)}
      />
      <AddAppConfigDialog
        open={addOpen}
        handleClose={() => setAddOpen(false)}
      />
    </Card>
  );
}
