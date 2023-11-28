import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NumericRange from "../calculations/numericRange";
import { ScatteringOptions, useResultStore } from "./resultsStore";
import {
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  parseNumericInput,
} from "../utils/units";
import { RangeDiagram, MessageDiagram } from "./rangeDiagram";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";
import RangeTable from "./rangeTable";

export default function ResultsBar(props: {
  visableQRange: NumericRange | null;
  fullQrange: NumericRange | null;
}): JSX.Element {
  const resultStore = useResultStore();
  const requestedRange = useResultStore<NumericRange | null>((state) => {
    return state.requestedMax && state.requestedMin
      ? new NumericRange(state.requestedMin, state.requestedMax)
      : null;
  });

  let diagramVisible: NumericRange | null = null;
  let diagramFull: NumericRange | null = null;
  let diagramRequested: NumericRange | null = requestedRange;

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

  if (props.visableQRange && props.fullQrange && requestedRange) {
    switch (resultStore.requested) {
      case ScatteringOptions.d:
        diagramVisible = props.visableQRange.apply(convertBetweenQAndD);
        diagramFull = props.fullQrange.apply(convertBetweenQAndD);
        if (resultStore.dUnits === WavelengthUnits.angstroms) {
          diagramRequested = requestedRange.apply(angstroms2Nanometres);
        }
        break;
      case ScatteringOptions.s:
        diagramVisible = props.visableQRange.apply(convertBetweenQAndS);
        diagramFull = props.fullQrange.apply(convertBetweenQAndS);
        if (resultStore.sUnits === WavelengthUnits.angstroms) {
          diagramRequested = requestedRange.apply(angstroms2Nanometres);
        }
        break;
      default:
        diagramVisible = props.visableQRange;
        diagramFull = props.fullQrange;
        if (resultStore.qUnits === ReciprocalWavelengthUnits.angstroms) {
          diagramRequested = requestedRange.apply(nanometres2Angstroms);
        }
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ height: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <RangeTable qRange={props.visableQRange} />
              <Divider orientation="vertical" />
              <Stack flexGrow={2}>
                <Stack spacing={1}>
                  <Stack direction={"row"} spacing={1}>
                    <Stack spacing={1}>
                      <Typography>
                        Requested min {resultStore.requested} value:{" "}
                      </Typography>
                      <Typography>
                        Requested max {resultStore.requested} value:{" "}
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <TextField
                        type="number"
                        size="small"
                        value={resultStore.requestedMin}
                        onChange={handleRequestedMin}
                      />
                      <TextField
                        type="number"
                        size="small"
                        value={resultStore.requestedMax}
                        onChange={handleRequestedMax}
                      />
                    </Stack>
                    <FormControl>
                      <FormLabel>Requested Quantiy</FormLabel>
                      <RadioGroup
                        row
                        value={resultStore.requested}
                        onChange={(event) =>
                          resultStore.updateRequested(
                            event.target.value as ScatteringOptions,
                          )
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
                  </Stack>
                </Stack>
                {((): JSX.Element => {
                  if (
                    diagramVisible &&
                    diagramFull &&
                    diagramRequested &&
                    {
                      /*diagramFull.containsRange(diagramVisible)*/
                    }
                  ) {
                    return (
                      <RangeDiagram
                        visibleQRange={diagramVisible}
                        fullQRange={diagramFull}
                        requestedRange={diagramRequested}
                      />
                    );
                  } else {
                    return <MessageDiagram message="No solution" />;
                  }
                })()}
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
