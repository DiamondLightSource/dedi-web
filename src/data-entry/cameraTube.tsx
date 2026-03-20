import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCameraTubeStore } from "./cameraTubeStore";
import { useDetectorStore } from "./detectorStore";
import { useBeamstopStore } from "./beamstopStore";
import { LengthUnits, MuSymbol } from "../utils/units";
import { sanitizeNumber } from "../utils/types";
import { InfoRow } from "../utils/InfoRow";
import { secondaryButtonSx } from "../utils/styles";
import React from "react";

/** Shared header strip used in both the empty and populated states. */
function CardHeader() {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: "grey.100",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Camera Tube
      </Typography>
    </Box>
  );
}

/**
 * Component with inputs for camera tube data entry.
 */
export default function CameraTubeDataEntry(): React.JSX.Element {
  const cameraTubeStore = useCameraTubeStore();
  const detector = useDetectorStore((state) => state.detector);
  const beamstopCentre = useBeamstopStore((state) => state.beamstop.centre);

  const centreDetector = () => {
    cameraTubeStore.updateCentre({
      x: detector.resolution.width / 2,
      y: detector.resolution.height / 2,
    });
  };

  const centreBeamstop = () => {
    if (beamstopCentre.x == null || beamstopCentre.y == null) return;
    cameraTubeStore.updateCentre({ x: beamstopCentre.x, y: beamstopCentre.y });
  };

  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTubeStore.updateCentre({ x: parseFloat(event.target.value) });
  };
  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    cameraTubeStore.updateCentre({ y: parseFloat(event.target.value) });
  };

  const handleDiameter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!cameraTubeStore.cameraTube) return;
    cameraTubeStore.updateDiameter(
      parseFloat(event.target.value),
      cameraTubeStore.cameraTube.diameter.formatUnits() as LengthUnits,
    );
  };

  if (!cameraTubeStore.cameraTube) {
    return (
      <Card variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
        <CardHeader />
        <Stack sx={{ p: 2 }}>
          <Button
            size="small"
            variant="outlined"
            sx={secondaryButtonSx}
            onClick={() => cameraTubeStore.restoreCameraTube()}
          >
            Add camera tube
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
      <CardHeader />
      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Diameter */}
        <InfoRow label="Diameter">
          <TextField
            type="number"
            size="small"
            label="Diameter"
            value={cameraTubeStore.cameraTube.diameter.toNumber()}
            onChange={handleDiameter}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small">
            <InputLabel>units</InputLabel>
            <Select
              label="units"
              value={cameraTubeStore.cameraTube.diameter.formatUnits()}
              onChange={(event) =>
                cameraTubeStore.updateDiameterUnits(
                  event.target.value as LengthUnits,
                )
              }
            >
              <MenuItem value={LengthUnits.millimetre}>
                {LengthUnits.millimetre}
              </MenuItem>
              <MenuItem value={LengthUnits.micrometre}>{MuSymbol}m</MenuItem>
            </Select>
          </FormControl>
        </InfoRow>

        {/* Position */}
        <Stack spacing={1}>
          <InfoRow label="Position">
            <TextField
              type="number"
              size="small"
              label="x"
              value={sanitizeNumber(cameraTubeStore.cameraTube.centre.x)}
              onChange={handleX}
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">px</InputAdornment>
                ),
              }}
            />
            <TextField
              type="number"
              size="small"
              label="y"
              value={sanitizeNumber(cameraTubeStore.cameraTube.centre.y)}
              onChange={handleY}
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">px</InputAdornment>
                ),
              }}
            />
          </InfoRow>
          <Stack direction="row" spacing={1} sx={{ pl: "90px" }}>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={centreDetector}
            >
              Centre detector
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={centreBeamstop}
              disabled={beamstopCentre.x == null || beamstopCentre.y == null}
            >
              Centre beamstop
            </Button>
          </Stack>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          sx={{
            ...secondaryButtonSx,
            color: "error.main",
            borderColor: "error.light",
            "&:hover": { bgcolor: "error.50", borderColor: "error.main" },
          }}
          onClick={() => cameraTubeStore.removeCameraTube()}
        >
          Remove camera tube
        </Button>
      </Stack>
    </Card>
  );
}
