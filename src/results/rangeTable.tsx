import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NumericRange from "../calculations/numericRange";
import { ScatteringOptions, useResultStore } from "./resultsStore";
import {
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  angstroms2Nanometres,
  nanometres2Angstroms,
} from "../utils/units";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";

export default function RangeTable(props: {
  qRange: NumericRange | null;
}): JSX.Element {
  const resultsStore = useResultStore();
  const updateQUnits = useResultStore((state) => state.updateQUnits);
  const updateSUnits = useResultStore((state) => state.updateSUnits);
  const updateDUnits = useResultStore((state) => state.updateDUnits);

  const handleQunits = (
    event: SelectChangeEvent<ReciprocalWavelengthUnits>,
  ) => {
    updateQUnits(event.target.value as ReciprocalWavelengthUnits);
  };

  const handleSunits = (event: SelectChangeEvent<WavelengthUnits>) => {
    updateSUnits(event.target.value as WavelengthUnits);
  };

  const handleDunits = (event: SelectChangeEvent<WavelengthUnits>) => {
    updateDUnits(event.target.value as WavelengthUnits);
  };

  let qRange = props.qRange;
  let sRange: NumericRange | null = null;
  let dRange: NumericRange | null = null;

  if (props.qRange) {
    sRange = props.qRange.apply(convertBetweenQAndS);
    dRange = props.qRange.apply(convertBetweenQAndD);
    if (resultsStore.qUnits === ReciprocalWavelengthUnits.angstroms) {
      qRange = props.qRange.apply(angstroms2Nanometres);
    }

    if (resultsStore.sUnits === WavelengthUnits.angstroms) {
      sRange = sRange.apply(nanometres2Angstroms);
    }

    if (resultsStore.dUnits === WavelengthUnits.angstroms) {
      dRange = dRange.apply(nanometres2Angstroms);
    }
  }
  return (
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
            <TableRow key={"q"}>
              <TableCell component="th" scope="row">
                {ScatteringOptions.q}
              </TableCell>
              <TableCell align="right">
                {qRange ? qRange.min.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                {qRange ? qRange.max.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                <FormControl>
                  <InputLabel>q</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={resultsStore.qUnits}
                    onChange={handleQunits}
                  >
                    <MenuItem value={ReciprocalWavelengthUnits.nanmometres}>
                      {ReciprocalWavelengthUnits.nanmometres}
                    </MenuItem>
                    <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                      {ReciprocalWavelengthUnits.angstroms}
                    </MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
            <TableRow key={"s"}>
              <TableCell component="th" scope="row">
                {ScatteringOptions.s}
              </TableCell>
              <TableCell align="right">
                {sRange ? sRange.min.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                {sRange ? sRange.max.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                <FormControl>
                  <InputLabel>s</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={resultsStore.sUnits}
                    onChange={handleSunits}
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
            <TableRow key={"d"}>
              <TableCell component="th" scope="row">
                {ScatteringOptions.d}
              </TableCell>
              <TableCell align="right">
                {dRange ? dRange.min.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                {dRange ? dRange.max.toFixed(4) : ""}
              </TableCell>
              <TableCell align="right">
                <FormControl>
                  <InputLabel>d</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={resultsStore.dUnits}
                    onChange={handleDunits}
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
  );
}
