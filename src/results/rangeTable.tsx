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
import { ScatteringOptions, useResultStore } from "./resultsStore";
import { ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";
import UnitRange from "../calculations/unitRange";


export default function RangeTable(props: {
  qRange: UnitRange;
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
  const qRange = props.qRange.to(resultsStore.qUnits as string)
  const sRange = props.qRange.apply(convertBetweenQAndS).to(resultsStore.sUnits as string);
  const dRange = props.qRange.apply(convertBetweenQAndD).to(resultsStore.dUnits as string);


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
                {qRange.min.toNumber().toFixed(4)}
              </TableCell>
              <TableCell align="right">
                {qRange.max.toNumber().toFixed(4)}
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
                      {"1 / nm"}
                    </MenuItem>
                    <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                      {"1 / " + "\u212B"}
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
                {sRange.min.toNumber().toFixed(4)}
              </TableCell>
              <TableCell align="right">
                {sRange.max.toNumber().toFixed(4)}
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
                      {"\u212B"}
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
                {dRange.min.toNumber().toFixed(4)}
              </TableCell>
              <TableCell align="right">
                {dRange.max.toNumber().toFixed(4)}
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
                      {"\u212B"}
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
