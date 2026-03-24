import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ScatteringOptions } from "./scatteringQuantities";
import { ResultsConfig } from "./resultsBar";
import {
  AngstromSymbol,
  ReciprocalWavelengthUnits,
  WavelengthUnits,
} from "../utils/units";
import { convertFromQtoD, convertFromQToS } from "./scatteringQuantities";
import UnitRange from "../calculations/unitRange";

export default function RangeTable(props: {
  qRange: UnitRange;
  config: ResultsConfig;
  updateConfig: (partial: Partial<ResultsConfig>) => void;
}): React.JSX.Element {
  const { config, updateConfig } = props;

  const handleQunits = (
    event: SelectChangeEvent<ReciprocalWavelengthUnits>,
  ) => {
    updateConfig({ qUnits: event.target.value as ReciprocalWavelengthUnits });
  };

  const handleSunits = (
    event: SelectChangeEvent<ReciprocalWavelengthUnits>,
  ) => {
    updateConfig({ sUnits: event.target.value as ReciprocalWavelengthUnits });
  };

  const handleDunits = (event: SelectChangeEvent<WavelengthUnits>) => {
    updateConfig({ dUnits: event.target.value as WavelengthUnits });
  };
  const qRange = props.qRange.to(config.qUnits as string);
  const sRange = props.qRange
    .apply(convertFromQToS)
    .to(config.sUnits as string);
  const dRange = props.qRange
    .apply(convertFromQtoD)
    .to(config.dUnits as string);

  return (
    <Card variant="outlined" sx={{ p: 0, overflow: "hidden" }}>
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Visible Range
        </Typography>
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 50 }} aria-label="simple table" size="small">
          {/* TABLE HEAD */}
          <TableHead>
            <TableRow>
              <TableCell align="center">Values</TableCell>
              <TableCell align="center" sx={{ width: 90 }}>
                Min
              </TableCell>
              <TableCell align="center" sx={{ width: 90 }}>
                Max
              </TableCell>
              <TableCell align="center">Units</TableCell>
            </TableRow>
          </TableHead>
          {/* TABLE BODY */}
          <TableBody>
            <TableRow key={"q"}>
              {/* Q RANGE ROW */}
              <TableCell component="th" scope="row" align="center">
                {ScatteringOptions.q}
              </TableCell>
              <TableCell align="center">
                {isNaN(qRange.min.toNumber())
                  ? ""
                  : qRange.min.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                {isNaN(qRange.max.toNumber())
                  ? ""
                  : qRange.max.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>q</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={config.qUnits}
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
                  : sRange.min.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                {isNaN(sRange.max.toNumber())
                  ? ""
                  : sRange.max.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>s</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={config.sUnits}
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
                  : dRange.min.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                {isNaN(dRange.max.toNumber())
                  ? ""
                  : dRange.max.toNumber().toExponential(3)}
              </TableCell>
              <TableCell align="center">
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>d</InputLabel>
                  <Select
                    size="small"
                    label="units"
                    value={config.dUnits}
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
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
