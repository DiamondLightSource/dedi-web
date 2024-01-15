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
import UnitRange from "../calculations/unitRange";
import { ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";
import { TableSection } from "./TableSection";
import { ScatteringOptions, useResultStore } from "./resultsStore";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "./scatteringQuantities";

// todo suggestion: big component, could be split OR comments used to indicate sections
export default function RangeTable(props: { qRange: UnitRange }): JSX.Element {
  // todo suggestion: this could be typed
  const resultsStore = useResultStore();
  const updateQUnits = useResultStore((state) => state.updateQUnits);
  const updateSUnits = useResultStore((state) => state.updateSUnits);
  const updateDUnits = useResultStore((state) => state.updateDUnits);

  const handleQunits = (
    event: SelectChangeEvent<string>,
  ) => {
    updateQUnits(event.target.value as ReciprocalWavelengthUnits);
  };

  const handleSunits = (event: SelectChangeEvent<string>) => {
    updateSUnits(event.target.value as WavelengthUnits);
  };

  const handleDunits = (event: SelectChangeEvent<string>) => {
    updateDUnits(event.target.value as WavelengthUnits);
  };
  const qRange = props.qRange.to(resultsStore.qUnits as string);
  const sRange = props.qRange
    .apply(convertBetweenQAndS)
    .to(resultsStore.sUnits as string);
  const dRange = props.qRange
    .apply(convertBetweenQAndD)
    .to(resultsStore.dUnits as string);

  return (
    <Box flexGrow={1}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 50 }} aria-label="simple table" size="small">
          {/* TABLE HEAD */}
          <TableHead>
            <TableRow>
              <TableCell>Values</TableCell>
              <TableCell align="right">Min</TableCell>
              <TableCell align="right">Max</TableCell>
              <TableCell align="right">Units</TableCell>
            </TableRow>
          </TableHead>
          {/* TABLE BODY */}
          <TableBody>
            {/* TABLE Q ROWS */}
            <TableRow key={"q"}>
              <TableCell component="th" scope="row">
                {ScatteringOptions.q}
              </TableCell>
              <TableCell align="right">
                {isNaN(qRange.min.toNumber())
                  ? ""
                  : qRange.min.toNumber().toFixed(4)}
              </TableCell>
              <TableCell align="right">
                {isNaN(qRange.max.toNumber())
                  ? ""
                  : qRange.max.toNumber().toFixed(4)}
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
            <TableSection
              key={ScatteringOptions.s}
              range={sRange}
              units={resultsStore.sUnits}
              updateCallback={handleSunits}
            />
            <TableSection
              key={ScatteringOptions.d}
              range={dRange}
              units={resultsStore.dUnits}
              updateCallback={handleDunits}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


