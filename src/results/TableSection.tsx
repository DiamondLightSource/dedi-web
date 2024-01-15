import {
  FormControl,
  InputLabel,
  MenuItem, Select,
  SelectChangeEvent, TableCell, TableRow
} from "@mui/material";
import UnitRange from "../calculations/unitRange";
import { ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";
import { ScatteringOptions } from "./resultsStore";

// todo opinions on type/interface are divided
type TableSectionProps = {
  key: ScatteringOptions;
  range: UnitRange;
  units: WavelengthUnits | ReciprocalWavelengthUnits;
  updateCallback: (
    event: SelectChangeEvent<WavelengthUnits | ReciprocalWavelengthUnits>
  ) => void;
};
// todo adapt this for q (reverse units)
export function TableSection({ key, units, range, updateCallback }: TableSectionProps) {
  return <TableRow key={key}>
    <TableCell component="th" scope="row">
      {key}
    </TableCell>
    <TableCell align="right">
      {isNaN(range.min.toNumber())
        ? ""
        : range.min.toNumber().toFixed(4)}
    </TableCell>
    <TableCell align="right">
      {isNaN(range.max.toNumber())
        ? ""
        : range.max.toNumber().toFixed(4)}
    </TableCell>
    <TableCell align="right">
      <FormControl>
        <InputLabel>{key}</InputLabel>
        <Select
          size="small"
          label="units"
          value={units}
          onChange={updateCallback}
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
  </TableRow>;

}
