import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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

  const stepCameraLength = (direction: 1 | -1) => {
    const { cameraLength, cameraLimits } = beamlineConfigStore.beamline;
    const step = cameraLimits.step.toNumber();
    const min = cameraLimits.min.toNumber();
    const max = cameraLimits.max.toNumber();
    const current = cameraLength ?? min;
    const next = Math.round((current + direction * step) * 1e9) / 1e9;
    beamlineConfigStore.updateCameraLength(Math.min(max, Math.max(min, next)));
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
              {beamline.wavelengthLimits.min.to(beamline.wavelength.formatUnits()).toString()}
            </Typography>
          </InfoRow>
          <InfoRow label="λ max">
            <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
              {beamline.wavelengthLimits.max.to(beamline.wavelength.formatUnits()).toString()}
            </Typography>
          </InfoRow>
        </Stack>

        {/* Camera length */}
        <InfoRow label="Camera length">
          <IconButton
            size="small"
            onClick={() => stepCameraLength(-1)}
            disabled={
              beamline.cameraLength !== null &&
              beamline.cameraLength <= beamline.cameraLimits.min.toNumber()
            }
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              py: "6px",
              fontSize: "0.875rem",
              fontFamily: "monospace",
            }}
          >
            {sanitizeNumber(beamline.cameraLength)} m
          </Typography>
          <IconButton
            size="small"
            onClick={() => stepCameraLength(1)}
            disabled={
              beamline.cameraLength !== null &&
              beamline.cameraLength >= beamline.cameraLimits.max.toNumber()
            }
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </InfoRow>

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
              <MenuItem value={AngleUnits.radians}>{AngleUnits.radians}</MenuItem>
              <MenuItem value={AngleUnits.degrees}>{AngleUnits.degrees}</MenuItem>
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
