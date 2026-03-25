import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import NumericRange from "../calculations/numericRange";
import UnitRange from "../calculations/unitRange";
import {
  AngstromSymbol,
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  parseNumericInput,
} from "../utils/units";
import { MessageDiagram } from "./MessageDiagram";
import { RangeDiagram } from "./rangeDiagram";
import RangeTable from "./rangeTable";
import { ScatteringOptions } from "./scatteringQuantities";
import { convertFromQtoD, convertFromQToS } from "./scatteringQuantities";
import { sanitizeNumber } from "../utils/types";

export interface ResultsConfig {
  requested: ScatteringOptions;
  qUnits: ReciprocalWavelengthUnits;
  sUnits: ReciprocalWavelengthUnits;
  dUnits: WavelengthUnits;
  requestedMin: number | null;
  requestedMax: number | null;
}

interface VisibilitySettings {
  textBoxUnits: WavelengthUnits | ReciprocalWavelengthUnits | null;
  diagramVisible: UnitRange | null;
  diagramRequested: UnitRange | null;
}

function getVisibilitySettings(
  visableQRange: UnitRange,
  requestedRange: NumericRange | null,
  config: ResultsConfig,
): VisibilitySettings {
  if (!(visableQRange && requestedRange)) {
    return {
      textBoxUnits: null,
      diagramVisible: null,
      diagramRequested: null,
    };
  }

  if (config.requested === ScatteringOptions.d) {
    return {
      textBoxUnits: config.dUnits,
      diagramVisible: visableQRange
        .apply(convertFromQtoD)
        .to(WavelengthUnits.nanometres),
      diagramRequested: UnitRange.fromNumericRange(
        requestedRange,
        config.dUnits as string,
      ).to(WavelengthUnits.nanometres),
    };
  }

  if (config.requested === ScatteringOptions.s) {
    return {
      textBoxUnits: config.sUnits,
      diagramVisible: visableQRange
        .apply(convertFromQToS)
        .to(ReciprocalWavelengthUnits.nanometres),
      diagramRequested: UnitRange.fromNumericRange(
        requestedRange,
        config.sUnits as string,
      ).to(ReciprocalWavelengthUnits.nanometres),
    };
  }

  return {
    textBoxUnits: config.qUnits,
    diagramVisible: visableQRange.to(ReciprocalWavelengthUnits.nanometres),
    diagramRequested: UnitRange.fromNumericRange(
      requestedRange,
      config.qUnits as string,
    ).to(ReciprocalWavelengthUnits.nanometres),
  };
}

function RangeFormControl({
  config,
  updateConfig,
}: {
  config: ResultsConfig;
  updateConfig: (partial: Partial<ResultsConfig>) => void;
}): React.JSX.Element {
  return (
    <FormControl>
      <FormLabel>Requested Quantity</FormLabel>
      <RadioGroup
        row
        value={config.requested}
        onChange={(event) =>
          updateConfig({ requested: event.target.value as ScatteringOptions })
        }
      >
        <FormControlLabel
          value={ScatteringOptions.q}
          control={<Radio />}
          label={ScatteringOptions.q}
        />
        <FormControlLabel
          value={ScatteringOptions.s}
          control={<Radio />}
          label={ScatteringOptions.s}
        />
        <FormControlLabel
          value={ScatteringOptions.d}
          control={<Radio />}
          label={ScatteringOptions.d}
        />
      </RadioGroup>
    </FormControl>
  );
}

// NOTE when it's outside it's not redefined on every render
const displayUnits = (
  textBoxUnits: WavelengthUnits | ReciprocalWavelengthUnits | null,
): string => {
  if (textBoxUnits === null) return "";
  switch (textBoxUnits as string) {
    case "angstrom":
      return AngstromSymbol;
    case "angstrom^-1":
      return AngstromSymbol + "^-1";
    default:
      return textBoxUnits as string;
  }
};

interface ResultsBarProps {
  visibleQRange: NumericRange | null;
  accessibleQRanges: NumericRange[];
  config: ResultsConfig;
  updateConfig: (partial: Partial<ResultsConfig>) => void;
}

export default function ResultsBar({
  visibleQRange,
  accessibleQRanges,
  config,
  updateConfig,
}: ResultsBarProps) {
  const visibleQRangeUnits = UnitRange.fromNumericRange(
    visibleQRange,
    "m^-1",
  ).to(ReciprocalWavelengthUnits.nanometres);

  // Convert accessible sub-ranges to the same unit space as diagramVisible
  // so dead zone positions align correctly on the diagram.
  const diagramAccessible = accessibleQRanges
    .map((r) =>
      UnitRange.fromNumericRange(r, "m^-1").to(
        ReciprocalWavelengthUnits.nanometres,
      ),
    )
    .map((r) => {
      if (config.requested === ScatteringOptions.d)
        return r.apply(convertFromQtoD).to(WavelengthUnits.nanometres);
      if (config.requested === ScatteringOptions.s)
        return r
          .apply(convertFromQToS)
          .to(ReciprocalWavelengthUnits.nanometres);
      return r.to(ReciprocalWavelengthUnits.nanometres);
    });

  const requestedRange =
    config.requestedMax != null && config.requestedMin != null
      ? new NumericRange(config.requestedMin, config.requestedMax)
      : null;

  const handleRequestedMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ requestedMax: parseNumericInput(event.target.value) });
  };

  const handleRequestedMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ requestedMin: parseNumericInput(event.target.value) });
  };

  const { textBoxUnits, diagramVisible, diagramRequested } =
    getVisibilitySettings(visibleQRangeUnits, requestedRange, config);

  const units = displayUnits(textBoxUnits);
  return (
    <Stack direction={{ md: "column", lg: "row" }} spacing={1}>
      {/* Range Table */}
      <RangeTable
        qRange={visibleQRangeUnits}
        config={config}
        updateConfig={updateConfig}
      />
      {/* Requested Range + Diagram */}
      <Card variant="outlined" sx={{ p: 0, overflow: "hidden", flexGrow: 2 }}>
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
            Requested Range
          </Typography>
        </Box>
        <CardContent>
          <Stack
            direction={{ md: "column", lg: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Stack direction={"column"} spacing={1}>
              <RangeFormControl config={config} updateConfig={updateConfig} />
              <TextField
                type="number"
                label={`Min`}
                size="small"
                value={sanitizeNumber(config.requestedMin)}
                onChange={handleRequestedMin}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="body2"
                        sx={{ minWidth: "4.5em", textAlign: "right" }}
                      >
                        {units}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type="number"
                label={`Max`}
                size="small"
                value={sanitizeNumber(config.requestedMax)}
                onChange={handleRequestedMax}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography
                        variant="body2"
                        sx={{ minWidth: "4.5em", textAlign: "right" }}
                      >
                        {units}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Stack
              flexGrow={1}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {diagramVisible && diagramRequested ? (
                <RangeDiagram
                  visibleRange={diagramVisible satisfies UnitRange}
                  requestedRange={diagramRequested}
                  accessibleRanges={diagramAccessible}
                />
              ) : (
                <MessageDiagram message="No solution" />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
