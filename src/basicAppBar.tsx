import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Chip } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useBeamlineConfigStore } from "./data-entry/beamlineconfigStore";
import { useBeamstopStore } from "./data-entry/beamstopStore";
import { useCameraTubeStore } from "./data-entry/cameraTubeStore";
import { LengthUnits } from "./utils/units";
import { createAppConfig } from "./presets/presetManager";

export default function BasicAppBar() {
  const beamlineConfigStore = useBeamlineConfigStore();
  const { presetRecord, currentPresetName, userWavelength } = beamlineConfigStore;
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();

  const beamstop = beamstopStore.beamstop;
  const cameraTube = cameraTubeStore.cameraTube;
  const preset = presetRecord[currentPresetName];

  const isDirtyBeamstop = preset
    ? Math.abs(beamstop.diameter.toNumber(LengthUnits.millimetre) - preset.beamstop.diameter) > 1e-9
    : false;
  const isDirtyCameraTube = preset
    ? (preset.cameraTube == null) !== (cameraTube == null) ||
      (preset.cameraTube != null && cameraTube != null &&
        Math.abs(cameraTube.diameter.toNumber(LengthUnits.millimetre) - preset.cameraTube.diameter) > 1e-9)
    : false;
  const isWavelengthUnset = userWavelength === null || isNaN(userWavelength);

  const handleResetBeamstop = () => beamstopStore.setBeamstop(createAppConfig(preset).beamstop);
  const handleResetCameraTube = () => cameraTubeStore.updateCameraTube(createAppConfig(preset).cameraTube);

  return (
    <AppBar style={{ width: "100%" }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dedi Web
        </Typography>
        {isWavelengthUnset && (
          <Chip
            icon={<WarningAmberIcon />}
            label="Wavelength not set"
            color="warning"
            size="small"
            sx={{ fontFamily: "monospace" }}
          />
        )}
        {isDirtyBeamstop && (
          <Chip
            icon={<WarningAmberIcon />}
            label="Beamstop ⌀ mismatch"
            deleteIcon={<RestartAltIcon />}
            onDelete={handleResetBeamstop}
            color="warning"
            size="small"
            sx={{ fontFamily: "monospace" }}
          />
        )}
        {isDirtyCameraTube && (
          <Chip
            icon={<WarningAmberIcon />}
            label="Camera tube ⌀ mismatch"
            deleteIcon={<RestartAltIcon />}
            onDelete={handleResetCameraTube}
            color="warning"
            size="small"
            sx={{ fontFamily: "monospace" }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
