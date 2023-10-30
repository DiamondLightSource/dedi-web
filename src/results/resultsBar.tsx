import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import NumericRange from "../calculations/numericRange";
import { ScatteringOptions, useResultStore } from "./resultsStore";
import { ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";
import RangeDiagram from "./rangeDiagram";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

export default function ResultsBar(props: {
  visableQRange: NumericRange;
  fullQrange: NumericRange;
}): JSX.Element {
  const resultStore = useResultStore();
  const updateQUnits = useResultStore((state) => state.updateQUnits);
  const updateSUnits = useResultStore((state) => state.updateSUnits);
  const updateDUnits = useResultStore((state) => state.updateDUnits);

  const qRange = new NumericRange(
    resultStore.q.fromQ(props.visableQRange.min),
    resultStore.q.fromQ(props.visableQRange.max),
  );
  const sRange = new NumericRange(
    resultStore.s.fromQ(props.visableQRange.min),
    resultStore.s.fromQ(props.visableQRange.max),
  );
  const dRange = new NumericRange(
    resultStore.d.fromQ(props.visableQRange.min),
    resultStore.d.fromQ(props.visableQRange.max),
  );

  let ajustedVisibleRange: NumericRange;
  let ajustedFullRange: NumericRange;
  let ajustedRequestedRange: NumericRange;

  switch (resultStore.requested) {
    case ScatteringOptions.s:
      ajustedVisibleRange = sRange;
      ajustedFullRange = new NumericRange(
        resultStore.s.fromQ(props.fullQrange.min),
        resultStore.s.fromQ(props.fullQrange.max),
      );
      ajustedRequestedRange = new NumericRange(
        resultStore.s.fromQ(resultStore.requestedRange.min),
        resultStore.s.fromQ(resultStore.requestedRange.max),
      );
      break;
    case ScatteringOptions.d:
      ajustedVisibleRange = dRange;
      ajustedFullRange = new NumericRange(
        resultStore.d.fromQ(props.fullQrange.min),
        resultStore.d.fromQ(props.fullQrange.max),
      );
      ajustedRequestedRange = new NumericRange(
        resultStore.d.fromQ(resultStore.requestedRange.min),
        resultStore.d.fromQ(resultStore.requestedRange.max),
      );
      break;
    default:
      ajustedVisibleRange = qRange;
      ajustedFullRange = new NumericRange(
        resultStore.q.fromQ(props.fullQrange.min),
        resultStore.q.fromQ(props.fullQrange.max),
      );
      ajustedRequestedRange = new NumericRange(
        resultStore.q.fromQ(resultStore.requestedRange.min),
        resultStore.q.fromQ(resultStore.requestedRange.max),
      );
      break;
  }

  const handleRequestedMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (resultStore.requested) {
      case ScatteringOptions.s:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.requestedRange.min,
            resultStore.s.tooQ(parseFloat(event.target.value) ?? 1),
          ),
        );
        break;
      case ScatteringOptions.d:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.requestedRange.min,
            resultStore.d.tooQ(parseFloat(event.target.value) ?? 1),
          ),
        );
        break;
      default:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.requestedRange.min,
            resultStore.q.tooQ(parseFloat(event.target.value) ?? 1),
          ),
        );
        break;
    }
  };

  const handleRequestedMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (resultStore.requested) {
      case ScatteringOptions.s:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.s.tooQ(parseFloat(event.target.value) ?? 0),
            resultStore.requestedRange.max,
          ),
        );
        break;
      case ScatteringOptions.d:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.d.tooQ(parseFloat(event.target.value) ?? 0),
            resultStore.requestedRange.max,
          ),
        );
        break;
      default:
        resultStore.updateRequestedRange(
          new NumericRange(
            resultStore.q.tooQ(parseFloat(event.target.value) ?? 0),
            resultStore.requestedRange.max,
          ),
        );
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ height: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <Box flexGrow={1}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 50 }}
                    aria-label="simple table"
                    size="small"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Values</TableCell>
                        <TableCell align="right">Min</TableCell>
                        <TableCell align="right">Max</TableCell>
                        <TableCell align="right">Units</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={"q"}>
                        <TableCell component="th" scope="row">
                          {ScatteringOptions.q}
                        </TableCell>
                        <TableCell align="right">
                          {qRange.min.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          {qRange.max.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>q</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.q.units}
                              onChange={(event) =>
                                updateQUnits(
                                  event.target
                                    .value as ReciprocalWavelengthUnits,
                                )
                              }
                            >
                              <MenuItem
                                value={ReciprocalWavelengthUnits.nanmometres}
                              >
                                {ReciprocalWavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem
                                value={ReciprocalWavelengthUnits.angstroms}
                              >
                                {ReciprocalWavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                      <TableRow key={"things"}>
                        <TableCell component="th" scope="row">
                          {ScatteringOptions.s}
                        </TableCell>
                        <TableCell align="right">
                          {sRange.min.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          {sRange.max.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>s</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.s.units}
                              onChange={(event) =>
                                updateSUnits(
                                  event.target.value as WavelengthUnits,
                                )
                              }
                            >
                              <MenuItem value={WavelengthUnits.nanmometres}>
                                {WavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem value={WavelengthUnits.angstroms}>
                                {WavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                      <TableRow key={"things"}>
                        <TableCell component="th" scope="row">
                          {ScatteringOptions.d}
                        </TableCell>
                        <TableCell align="right">
                          {dRange.min.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          {dRange.max.toFixed(4)}
                        </TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>d</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.d.units}
                              onChange={(event) =>
                                updateDUnits(
                                  event.target.value as WavelengthUnits,
                                )
                              }
                            >
                              <MenuItem value={WavelengthUnits.nanmometres}>
                                {WavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem value={WavelengthUnits.angstroms}>
                                {WavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Divider orientation="vertical" />
              <Stack flexGrow={2}>
                <Stack spacing={2}>
                  <Stack direction={"row"} spacing={3}>
                    <Stack spacing={2}>
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
                        value={ajustedRequestedRange.min}
                        onChange={handleRequestedMin}
                      />
                      <TextField
                        type="number"
                        size="small"
                        value={ajustedRequestedRange.max}
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
                <RangeDiagram
                  visibleQRange={ajustedVisibleRange}
                  fullQRange={ajustedFullRange}
                  requestedRange={ajustedRequestedRange}
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
