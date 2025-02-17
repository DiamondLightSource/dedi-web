import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ScatteringOptions, useResultStore } from "./resultsStore";
import {
  AngstromSymbol,
  ReciprocalWavelengthUnits,
  WavelengthUnits,
} from "../utils/units";
import { convertFromQtoD, convertFromQToS } from "./scatteringQuantities";
import UnitRange from "../calculations/unitRange";

export default function RangeTable(props: { qRange: UnitRange }): JSX.Element {
  const resultsStore = useResultStore();

  const handleQunits = (
    event: SelectChangeEvent<ReciprocalWavelengthUnits>,
  ) => {
    resultsStore.updateQUnits(event.target.value as ReciprocalWavelengthUnits);
  };

  const handleSunits = (
    event: SelectChangeEvent<ReciprocalWavelengthUnits>,
  ) => {
    resultsStore.updateSUnits(event.target.value as ReciprocalWavelengthUnits);
  };

  const handleDunits = (event: SelectChangeEvent<WavelengthUnits>) => {
    resultsStore.updateDUnits(event.target.value as WavelengthUnits);
  };
  const qRange = props.qRange.to(resultsStore.qUnits as string);
  const sRange = props.qRange
    .apply(convertFromQToS)
    .to(resultsStore.sUnits as string);
  const dRange = props.qRange
    .apply(convertFromQtoD)
    .to(resultsStore.dUnits as string);

  return (
    <Card variant="outlined">
      <TableContainer>
        <Table sx={{ minWidth: 50 }} aria-label="simple table" size="small">
          {/* TABLE HEAD */}
          <TableHead>
            <TableRow>
              <TableCell align="center">Values</TableCell>
              <TableCell align="center">Min</TableCell>
              <TableCell align="center">Max</TableCell>
              <TableCell align="center">Units</TableCell>
            </TableRow>
          </TableHead>
          {/* TABLE BODY */}
          <TableRow key={"q"}>
            {/* Q RANGE ROW */}
            <TableCell component="th" scope="row" align="center">
              {ScatteringOptions.q}
            </TableCell>
            <TableCell align="center">
              {isNaN(qRange.min.toNumber())
                ? ""
                : qRange.min.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              {isNaN(qRange.max.toNumber())
                ? ""
                : qRange.max.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              <FormControl>
                <InputLabel>q</InputLabel>
                <Select
                  size="small"
                  label="units"
                  value={resultsStore.qUnits}
                  onChange={handleQunits}
                >
                  <MenuItem value={ReciprocalWavelengthUnits.nanometres}>
                    {"1 / nm"}
                  </MenuItem>
                  <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                    {"1 / " + AngstromSymbol}
                  </MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow key={"s"}>
            {/* S RANGE ROW*/}
            <TableCell component="th" scope="row" align="center">
              {ScatteringOptions.s}
            </TableCell>
            <TableCell align="center">
              {isNaN(sRange.min.toNumber())
                ? ""
                : sRange.min.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              {isNaN(sRange.max.toNumber())
                ? ""
                : sRange.max.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              <FormControl>
                <InputLabel>s</InputLabel>
                <Select
                  size="small"
                  label="units"
                  value={resultsStore.sUnits}
                  onChange={handleSunits}
                >
                  <MenuItem value={ReciprocalWavelengthUnits.nanometres}>
                    {"1 / nm"}
                  </MenuItem>
                  <MenuItem value={ReciprocalWavelengthUnits.angstroms}>
                    {"1 / " + AngstromSymbol}
                  </MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow key={"d"}>
            {/* D RANGE ROW*/}
            <TableCell component="th" scope="row" align="center">
              {ScatteringOptions.d}
            </TableCell>
            <TableCell align="center">
              {isNaN(dRange.min.toNumber())
                ? ""
                : dRange.min.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              {isNaN(dRange.max.toNumber())
                ? ""
                : dRange.max.toNumber().toPrecision(4)}
            </TableCell>
            <TableCell align="center">
              <FormControl>
                <InputLabel>d</InputLabel>
                <Select
                  size="small"
                  label="units"
                  value={resultsStore.dUnits}
                  onChange={handleDunits}
                >
                  <MenuItem value={WavelengthUnits.nanometres}>
                    {WavelengthUnits.nanometres}
                  </MenuItem>
                  <MenuItem value={WavelengthUnits.angstroms}>
                    {AngstromSymbol}
                  </MenuItem>
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    </Card>
  );
}
