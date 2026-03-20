import {
  Box,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  TextField,
  InputAdornment,
  Card,
} from "@mui/material";
import { LengthUnits, MuSymbol } from "../utils/units";
import { useBeamstopStore } from "./beamstopStore";
import { useDetectorStore } from "./detectorStore";
import { AppDetector } from "../utils/types";
import { sanitizeNumber } from "../utils/types";
import { InfoRow } from "../utils/InfoRow";
import { secondaryButtonSx } from "../utils/styles";
import React from "react";

/**
 * Component with data entry inputs for the Beamstop
 */
export default function BeamStopDataEntry(): React.JSX.Element {
  const beamstopStore = useBeamstopStore();

  const handleX = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateCentre({ x: parseFloat(event.target.value) });
  };

  const handleY = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateCentre({ y: parseFloat(event.target.value) });
  };

  const handleClearance = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateClearance(parseFloat(event.target.value));
  };

  const handleDiameter = (event: React.ChangeEvent<HTMLInputElement>) => {
    beamstopStore.updateDiameter(
      parseFloat(event.target.value),
      beamstopStore.beamstop.diameter.formatUnits() as LengthUnits,
    );
  };

  const detector = useDetectorStore<AppDetector>((state) => state.detector);

  const centreDetector = () => {
    beamstopStore.updateCentre({
      x: detector.resolution.width / 2,
      y: detector.resolution.height / 2,
    });
  };

  const centreTopEdge = () => {
    beamstopStore.updateCentre({ x: detector.resolution.width / 2, y: 0 });
  };

  return (
    <Card variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
      {/* Header strip */}
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
          Beamstop
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Diameter */}
        <InfoRow label="Diameter">
          <TextField
            type="number"
            size="small"
            label="Diameter"
            value={sanitizeNumber(beamstopStore.beamstop.diameter.toNumber())}
            onChange={handleDiameter}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small">
            <InputLabel>units</InputLabel>
            <Select
              label="units"
              value={beamstopStore.beamstop.diameter.formatUnits()}
              onChange={(event) =>
                beamstopStore.updateDiameterUnits(
                  event.target.value as LengthUnits,
                )
              }
            >
              <MenuItem value={LengthUnits.millimetre}>
                {LengthUnits.millimetre}
              </MenuItem>
              <MenuItem value={LengthUnits.micrometre}>
                {MuSymbol}m
              </MenuItem>
            </Select>
          </FormControl>
        </InfoRow>

        {/* Clearance */}
        <InfoRow label="Clearance">
          <TextField
            type="number"
            size="small"
            label="Clearance"
            value={sanitizeNumber(beamstopStore.beamstop.clearance)}
            onChange={handleClearance}
            sx={{ flexGrow: 1 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
          />
        </InfoRow>

        {/* Position */}
        <Stack spacing={1}>
          <InfoRow label="Position">
            <TextField
              type="number"
              size="small"
              label="x"
              value={sanitizeNumber(beamstopStore.beamstop.centre.x)}
              onChange={handleX}
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
              }}
            />
            <TextField
              type="number"
              size="small"
              label="y"
              value={sanitizeNumber(beamstopStore.beamstop.centre.y)}
              onChange={handleY}
              sx={{ flexGrow: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">px</InputAdornment>,
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
              onClick={centreTopEdge}
            >
              Centre top edge
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
