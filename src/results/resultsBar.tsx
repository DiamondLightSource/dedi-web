import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Stack,
  TextField,
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
import { ResultStore, ScatteringOptions, useResultStore } from "./resultsStore";
import { convertFromQtoD, convertFromQToS } from "./scatteringQuantities";
import { sanitizeNumber } from "../utils/types";

interface VisibilitySettings {
  textBoxUnits: WavelengthUnits | ReciprocalWavelengthUnits | null;
  diagramVisible: UnitRange | null;
  diagramFull: UnitRange | null;
  diagramRequested: UnitRange | null;
}

function getVisibilitySettings(
  visableQRange: UnitRange,
  fullQrange: UnitRange,
  requestedRange: NumericRange | null,
  resultStore: ResultStore,
): VisibilitySettings {
  if (!(visableQRange && fullQrange && requestedRange)) {
    return {
      textBoxUnits: null,
      diagramVisible: null,
      diagramFull: null,
      diagramRequested: null,
    };
  }

  if (resultStore.requested === ScatteringOptions.d) {
    return {
      textBoxUnits: resultStore.dUnits,
      diagramVisible: visableQRange
        .apply(convertFromQtoD)
        .to(WavelengthUnits.nanometres),
      diagramFull: fullQrange
        .apply(convertFromQtoD)
        .to(WavelengthUnits.nanometres),
      diagramRequested: UnitRange.fromNumericRange(
        requestedRange,
        resultStore.dUnits as string,
      ).to(WavelengthUnits.nanometres),
    };
  }

  if (resultStore.requested === ScatteringOptions.s) {
    return {
      textBoxUnits: resultStore.sUnits,
      diagramVisible: visableQRange
        .apply(convertFromQToS)
        .to(ReciprocalWavelengthUnits.nanometres),
      diagramFull: fullQrange
        .apply(convertFromQToS)
        .to(ReciprocalWavelengthUnits.nanometres),
      diagramRequested: UnitRange.fromNumericRange(
        requestedRange,
        resultStore.sUnits as string,
      ).to(ReciprocalWavelengthUnits.nanometres),
    };
  }

  return {
    textBoxUnits: resultStore.qUnits,
    diagramVisible: visableQRange.to(ReciprocalWavelengthUnits.nanometres),
    diagramFull: fullQrange.to(ReciprocalWavelengthUnits.nanometres),
    diagramRequested: UnitRange.fromNumericRange(
      requestedRange,
      resultStore.qUnits as string,
    ).to(ReciprocalWavelengthUnits.nanometres),
  };
}

function RangeFormControl({
  resultStore,
}: {
  resultStore: ResultStore;
}): React.JSX.Element {
  return (
    <FormControl>
      <FormLabel>Requested Quantiy</FormLabel>
      <RadioGroup
        row
        value={resultStore.requested}
        onChange={(event) =>
          resultStore.updateRequested(event.target.value as ScatteringOptions)
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
  switch (textBoxUnits as string) {
    case "angstrom":
      return AngstromSymbol;
    case "angstrom^-1":
      return AngstromSymbol + "^-1";
    case null:
      return "";
    default:
      return textBoxUnits as string;
  }
};

interface ResultsBarProps {
  visibleQRange: NumericRange | null;
  fullQRange: NumericRange | null;
}

export default function ResultsBar({
  visibleQRange,
  fullQRange,
}: ResultsBarProps) {
  const visibleQRangeUnits = UnitRange.fromNumericRange(
    visibleQRange,
    "m^-1",
  ).to(ReciprocalWavelengthUnits.nanometres);

  const fullQRangeUnits = UnitRange.fromNumericRange(fullQRange, "m^-1").to(
    ReciprocalWavelengthUnits.nanometres,
  );

  const resultStore = useResultStore();
  const requestedRange = useResultStore<NumericRange | null>((state) => {
    return state.requestedMax && state.requestedMin
      ? new NumericRange(state.requestedMin, state.requestedMax)
      : null;
  });

  const handleRequestedMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    resultStore.updateRequestedRange({
      requestedMax: parseNumericInput(event.target.value),
    });
  };

  const handleRequestedMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    resultStore.updateRequestedRange({
      requestedMin: parseNumericInput(event.target.value),
    });
  };

  const { textBoxUnits, diagramVisible, diagramFull, diagramRequested } =
    getVisibilitySettings(
      visibleQRangeUnits,
      fullQRangeUnits,
      requestedRange,
      resultStore,
    );

  const units = displayUnits(textBoxUnits);
  return (
    <Card
      variant="outlined"
      sx={{
        overflow: "visible",
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Stack
            direction={{ md: "column", lg: "row" }}
            spacing={2}
            sx={{ direction: "column" }}
          >
            {/* Range Table */}
            <RangeTable qRange={visibleQRangeUnits} />
            {/* Requested Range */}
            <Stack direction={"column"} spacing={1}>
              <RangeFormControl resultStore={resultStore} />
              <TextField
                type="number"
                label={`Requested min ${resultStore.requested} value`}
                size="small"
                value={sanitizeNumber(resultStore.requestedMin)}
                onChange={handleRequestedMin}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">{units}</InputAdornment>
                  ),
                }}
              />
              <TextField
                type="number"
                label={`Requested max ${resultStore.requested} value`}
                size="small"
                value={sanitizeNumber(resultStore.requestedMax)}
                onChange={handleRequestedMax}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">{units}</InputAdornment>
                  ),
                }}
              />
            </Stack>
            {/* Range Diagram */}
            <Stack flexGrow={2} sx={{ alignItems: "center" }}>
              {diagramVisible && diagramFull && diagramRequested ? (
                <RangeDiagram
                  visibleRange={diagramVisible satisfies UnitRange}
                  requestedRange={diagramRequested}
                />
              ) : (
                <MessageDiagram message="No solution" />
              )}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
