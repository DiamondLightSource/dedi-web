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
import { parseNumericInput } from "../utils/units";
import { RangeDiagram, MessageDiagram } from "./rangeDiagram";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";
import RangeTable from "./rangeTable";
import UnitRange from "../calculations/unitRange";

export default function ResultsBar(props: {
  visableQRange: UnitRange;
  fullQrange: UnitRange;
}): JSX.Element {
  const resultStore = useResultStore();
  const requestedRange = useResultStore<NumericRange | null>((state) => {
    return state.requestedMax && state.requestedMin
      ? new NumericRange(state.requestedMin, state.requestedMax)
      : null;
  });

  let diagramVisible: UnitRange | null = null;
  let diagramFull: UnitRange | null = null;
  let diagramRequested: UnitRange | null = null;

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
        diagramVisible = props.visableQRange
          .apply(convertBetweenQAndD)
          .to("nm");
        diagramFull = props.fullQrange.apply(convertBetweenQAndD).to("nm");
        diagramRequested = UnitRange.fromNumericRange(
          requestedRange,
          resultStore.dUnits as string,
        ).to("nm");
        break;
      case ScatteringOptions.s:
        diagramVisible = props.visableQRange
          .apply(convertBetweenQAndS)
          .to("nm");
        diagramFull = props.fullQrange.apply(convertBetweenQAndS).to("nm");
        diagramRequested = UnitRange.fromNumericRange(
          requestedRange,
          resultStore.sUnits as string,
        ).to("nm");
        break;
      default:
        diagramVisible = props.visableQRange.to("nm^-1");
        diagramFull = props.fullQrange.to("nm^-1");
        diagramRequested = UnitRange.fromNumericRange(
          requestedRange,
          resultStore.qUnits as string,
        ).to("nm^-1");
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
                    diagramFull.containsRange(diagramVisible)
                  ) {
                    return (
                      <RangeDiagram
                        visibleRange={diagramVisible}
                        fullRange={diagramFull}
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
