import {
  Autocomplete,
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LengthUnits, MuSymbol } from "../utils/units";
import { useDetectorStore } from "./detectorStore";
import { DetectorTableDialog, AddDetectorDialog } from "../dialogs/detector/detectorDialog";
import { InfoRow } from "../utils/InfoRow";
import { secondaryButtonSx } from "../utils/styles";
import React from "react";

/**
 * Component with data entry inputs for the Detector.
 */
export default function DetectorDataEntry(): React.JSX.Element {
  const detectorStore = useDetectorStore();
  const [tableOpen, setTableOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  const { detector } = detectorStore;
  const pixelUnit = detector.pixelSize.height.formatUnits();

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
          Detector
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        {/* Selector */}
        <Stack spacing={1}>
          <Autocomplete
            size="small"
            options={Object.keys(detectorStore.detectorRecord)}
            sx={{ flexGrow: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose detector" />
            )}
            value={detectorStore.name}
            onChange={(_, value) =>
              value ? detectorStore.updateDetector(value) : {}
            }
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={() => setTableOpen(true)}
            >
              Show all detectors
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{ ...secondaryButtonSx, flexGrow: 1 }}
              onClick={() => setAddOpen(true)}
            >
              Add detector
            </Button>
          </Stack>
          <DetectorTableDialog
            open={tableOpen}
            handleClose={() => setTableOpen(false)}
          />
          <AddDetectorDialog
            open={addOpen}
            handleClose={() => setAddOpen(false)}
          />
        </Stack>

        {/* Info rows */}
        <Stack spacing={0.75}>
          <InfoRow label="Resolution">
            <Typography variant="body2" sx={{ fontFamily: "monospace", flexGrow: 1 }}>
              {detector.resolution.height} × {detector.resolution.width} px
            </Typography>
          </InfoRow>
          <InfoRow label="Pixel size">
            <Typography variant="body2" sx={{ fontFamily: "monospace", flexGrow: 1 }}>
              {detector.pixelSize.height.toNumber()} × {detector.pixelSize.width.toNumber()}
            </Typography>
            <FormControl size="small">
              <InputLabel>units</InputLabel>
              <Select
                label="units"
                value={pixelUnit}
                onChange={(event) =>
                  detectorStore.updatePixelUnits(
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
        </Stack>
      </Stack>
    </Card>
  );
}

