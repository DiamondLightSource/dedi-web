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
import { AngleUnits, ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import RangeDiagram from "./rangeDiagram";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';



export default function ResultsBar(props: {
  visableQRange: NumericRange;
  fullQrange: NumericRange;
}): JSX.Element {
  const resultStore = useResultStore()
  const updateQUnits = useResultStore(state => state.updateQUnits);
  const updateSUnits = useResultStore(state => state.updateSUnits);
  const updateDUnits = useResultStore(state => state.updateDUnits);
  const updateThetaUnits = useResultStore(state => state.updateThetaUnits);
  const wavelength = useBeamlineConfigStore(state => state.wavelength);

  const qRange = new NumericRange(resultStore.q.fromQ(props.visableQRange.min), resultStore.q.fromQ(props.visableQRange.max));
  const sRange = new NumericRange(resultStore.s.fromQ(props.visableQRange.min), resultStore.s.fromQ(props.visableQRange.max));
  const dRange = new NumericRange(resultStore.d.fromQ(props.visableQRange.min), resultStore.d.fromQ(props.visableQRange.max));
  const thetaRange = new NumericRange(resultStore.twoTheta.fromQ(props.visableQRange.min), resultStore.twoTheta.fromQ(props.visableQRange.max));

  let ajustedVisibleRange: NumericRange;
  let ajustedFullRange: NumericRange;
  let ajustedRequestedRange: NumericRange;

  switch (resultStore.requested) {
    case ScatteringOptions.s:
      ajustedVisibleRange = sRange;
      ajustedFullRange = new NumericRange(resultStore.s.fromQ(props.fullQrange.min), resultStore.s.fromQ(props.fullQrange.max));
      ajustedRequestedRange = new NumericRange(resultStore.s.fromQ(resultStore.requestedRange.min), resultStore.s.fromQ(resultStore.requestedRange.max));
      break;
    case ScatteringOptions.d:
      ajustedVisibleRange = dRange;
      ajustedFullRange = new NumericRange(resultStore.d.fromQ(props.fullQrange.min), resultStore.d.fromQ(props.fullQrange.max));
      ajustedRequestedRange = new NumericRange(resultStore.d.fromQ(resultStore.requestedRange.min), resultStore.d.fromQ(resultStore.requestedRange.max));
      break;
    case ScatteringOptions.twoTheta:
      ajustedVisibleRange = thetaRange;
      ajustedFullRange = new NumericRange(resultStore.twoTheta.fromQ(props.fullQrange.min), resultStore.twoTheta.fromQ(props.fullQrange.max));
      ajustedRequestedRange = new NumericRange(resultStore.twoTheta.fromQ(resultStore.requestedRange.min), resultStore.twoTheta.fromQ(resultStore.requestedRange.max));
      break;
    default:
      ajustedVisibleRange = qRange;
      ajustedFullRange = new NumericRange(resultStore.q.fromQ(props.fullQrange.min), resultStore.q.fromQ(props.fullQrange.max));
      ajustedRequestedRange = new NumericRange(resultStore.q.fromQ(resultStore.requestedRange.min), resultStore.q.fromQ(resultStore.requestedRange.max));
      break;
  }


  return (
    <Box sx={{ flexGrow: 2 }}>
      <Card sx={{ height: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <Box flexGrow={1}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 50 }} aria-label="simple table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Values</TableCell>
                        <TableCell align="right">Min</TableCell>
                        <TableCell align="right">Max</TableCell>
                        <TableCell align="right">Units</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow
                        key={"q"}
                      >
                        <TableCell component="th" scope="row">q</TableCell>
                        <TableCell align="right">{qRange.min.toFixed(4)}</TableCell>
                        <TableCell align="right">{qRange.max.toFixed(4)}</TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>q</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.q.units}
                              onChange={(event) => updateQUnits(event.target.value as ReciprocalWavelengthUnits)}
                            >
                              <MenuItem value={ReciprocalWavelengthUnits.nanmometres}>
                                {ReciprocalWavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                                {ReciprocalWavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl></TableCell>
                      </TableRow>
                      <TableRow
                        key={"things"}
                      >
                        <TableCell component="th" scope="row">s</TableCell>
                        <TableCell align="right">{sRange.min.toFixed(4)}</TableCell>
                        <TableCell align="right">{sRange.max.toFixed(4)}</TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>s</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.s.units}
                              onChange={(event) => updateSUnits(event.target.value as ReciprocalWavelengthUnits)}
                            >
                              <MenuItem value={ReciprocalWavelengthUnits.nanmometres}>
                                {ReciprocalWavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                                {ReciprocalWavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl></TableCell>
                      </TableRow>
                      <TableRow
                        key={"things"}
                      >
                        <TableCell component="th" scope="row">d</TableCell>
                        <TableCell align="right">{dRange.min.toFixed(4)}</TableCell>
                        <TableCell align="right">{dRange.max.toFixed(4)}</TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>d</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.d.units}
                              onChange={(event) => updateDUnits(event.target.value as WavelengthUnits)}
                            >
                              <MenuItem value={WavelengthUnits.nanmometres}>
                                {WavelengthUnits.nanmometres}
                              </MenuItem>
                              <MenuItem value={WavelengthUnits.angstroms}>
                                {WavelengthUnits.angstroms}
                              </MenuItem>
                            </Select>
                          </FormControl></TableCell>
                      </TableRow>
                      <TableRow
                        key={"things"}
                      >
                        <TableCell component="th" scope="row">two theta</TableCell>
                        <TableCell align="right">{thetaRange.min.toFixed(4)}</TableCell>
                        <TableCell align="right">{thetaRange.max.toFixed(4)}</TableCell>
                        <TableCell align="right">
                          <FormControl>
                            <InputLabel>theta</InputLabel>
                            <Select
                              size="small"
                              label="units"
                              value={resultStore.twoTheta.units}
                              onChange={(event) => updateThetaUnits(event.target.value as AngleUnits, wavelength ?? 0)}
                            >
                              <MenuItem value={AngleUnits.radians}>
                                {AngleUnits.radians}
                              </MenuItem>
                              <MenuItem value={AngleUnits.degrees}>
                                {AngleUnits.degrees}
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
                      <Typography>Requested min {resultStore.requested} value: </Typography>
                      <Typography>Requested max {resultStore.requested} value: </Typography>
                    </Stack>
                    <Stack spacing={1}>
                      <TextField
                        type="number"
                        size="small"
                        value={resultStore.requestedRange.min}
                        onChange={(event) => {
                          resultStore.updateRequestedRange(new NumericRange(parseFloat(event.target.value) ?? 0, resultStore.requestedRange.max))
                        }}
                      />
                      <TextField
                        type="number"
                        size="small"
                        value={resultStore.requestedRange.max}
                        onChange={(event) => {
                          resultStore.updateRequestedRange(new NumericRange(resultStore.requestedRange.min, parseFloat(event.target.value) ?? 1))
                        }}
                      />
                    </Stack>
                    <FormControl>
                      <FormLabel>Requested Quantiy</FormLabel>
                      <RadioGroup
                        row
                        value={resultStore.requested}
                        onChange={(event) => resultStore.updateRequested(event.target.value as ScatteringOptions)}
                      >
                        <FormControlLabel value={ScatteringOptions.q} control={<Radio />} label={ScatteringOptions.q} />
                        <FormControlLabel value={ScatteringOptions.s} control={<Radio />} label={ScatteringOptions.s} />
                        <FormControlLabel value={ScatteringOptions.d} control={<Radio />} label={ScatteringOptions.d} />
                        <FormControlLabel value={ScatteringOptions.twoTheta} control={<Radio />} label={ScatteringOptions.twoTheta} />
                      </RadioGroup>
                    </FormControl>
                  </Stack>
                </Stack>
                <RangeDiagram visibleQRange={ajustedVisibleRange} fullQRange={ajustedFullRange} requestedRange={ajustedRequestedRange} />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box >
  );
}
