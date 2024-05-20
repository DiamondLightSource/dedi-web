import {
  Card,
  CardContent,
  Divider,
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
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  parseNumericInput,
} from "../utils/units";
import { MessageDiagram } from "./MessageDiagram";
import { RangeDiagram } from "./rangeDiagram";
import RangeTable from "./rangeTable";
import { ResultStore, ScatteringOptions, useResultStore } from "./resultsStore";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";

function getVisibilitySettings(
  visableQRange: UnitRange,
  fullQrange: UnitRange,
  requestedRange: NumericRange | null,
  resultStore: ResultStore,
) {
  let diagramVisible: UnitRange | null = null;
  let diagramFull: UnitRange | null = null;
  let diagramRequested: UnitRange | null = null;

  let textBoxUnits: WavelengthUnits | ReciprocalWavelengthUnits | null = null;
  // NOTE early return pattern , reduces nesting logic
  if (!(visableQRange && fullQrange && requestedRange)) {
    return { textBoxUnits, diagramVisible, diagramFull, diagramRequested };
  }

  switch (resultStore.requested) {
    case ScatteringOptions.d:
      diagramVisible = visableQRange.apply(convertBetweenQAndD).to("nm");
      diagramFull = fullQrange.apply(convertBetweenQAndD).to("nm");
      diagramRequested = UnitRange.fromNumericRange(
        requestedRange,
        resultStore.dUnits as string,
      ).to("nm");
      textBoxUnits = resultStore.dUnits;
      break;
    case ScatteringOptions.s:
      diagramVisible = visableQRange.apply(convertBetweenQAndS).to("nm");
      diagramFull = fullQrange.apply(convertBetweenQAndS).to("nm");
      diagramRequested = UnitRange.fromNumericRange(
        requestedRange,
        resultStore.sUnits as string,
      ).to("nm");
      textBoxUnits = resultStore.sUnits;
      break;
    default:
      diagramVisible = visableQRange.to("nm^-1");
      diagramFull = fullQrange.to("nm^-1");
      diagramRequested = UnitRange.fromNumericRange(
        requestedRange,
        resultStore.qUnits as string,
      ).to("nm^-1");
      textBoxUnits = resultStore.qUnits;
  }
  return { textBoxUnits, diagramVisible, diagramFull, diagramRequested };
}

function RangeFormControl({ resultStore }: { resultStore: ResultStore }) {
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
      return "\u212B";
    case "angstrom^-1":
      return "\u212B^-1";
    case null:
      return "";
    default:
      return textBoxUnits as string;
  }
};

interface ResultsBarProps {
  visableQRange: UnitRange;
  fullQrange: UnitRange;
}

export default function ResultsBar({
  visableQRange,
  fullQrange,
}: ResultsBarProps): JSX.Element {
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
      visableQRange,
      fullQrange,
      requestedRange,
      resultStore,
    );

  const units = displayUnits(textBoxUnits);
  return (
      <Card variant="outlined" sx={{ 
        height: 1 ,
        maxHeight: "27vh",
        overflow: "scroll",
        flexGrow: 1
        }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <RangeTable qRange={visableQRange} />
              <Divider orientation="vertical" />
              {/* SOME SECTION TITLE */}
              <Stack flexGrow={2}>
                <Stack spacing={1}>
                  <Stack direction={"row"} spacing={3}>
                    <Stack spacing={2}>
                      <Stack direction={"row"} spacing={2}>
                        <TextField
                          type="number"
                          label={`Requested min ${resultStore.requested} value`}
                          size="small"
                          value={resultStore.requestedMin}
                          onChange={handleRequestedMin}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {units}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                      <Stack direction={"row"} spacing={2}>
                        <TextField
                          type="number"
                          label={`Requested max ${resultStore.requested} value`}
                          size="small"
                          value={resultStore.requestedMax}
                          onChange={handleRequestedMax}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {units}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Stack>
                    </Stack>
                    <RangeFormControl resultStore={resultStore} />
                  </Stack>
                
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
          </Stack>
        </CardContent>
      </Card>
  );
}
