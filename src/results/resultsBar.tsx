import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import NumericRange from "../calculations/numericRange";
import RangeDiagram from "./rangeDiagram";
import { D, Q, S, ScatteringQuantity, TwoTheta, ReciprocalWavelengthUnitsOptions, AngleUnitsOptions, WavelengthUnitsOptions } from "./scatteringQuantities";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { usePlotStore, ScatteringOptions } from "../plot/plotStore";


export default function ResultsBar(props: {
  visableQRange: NumericRange;
  fullQrange: NumericRange;
}): JSX.Element {

  const requestedQRange = usePlotStore((state) => state.requestedRange);
  const selected = usePlotStore((state) => state.selected)
  const units = usePlotStore((state) => state.units)
  const update = usePlotStore((state) => state.update)
  const wavelength = useBeamlineConfigStore((state) => state.wavelength);
  let quantity: ScatteringQuantity;

  switch (selected) {
    case ScatteringOptions.d:
      quantity = new D("nanometres", WavelengthUnitsOptions);
      break;
    case ScatteringOptions.twoTheta:
      quantity = new TwoTheta("radians", wavelength ?? 0, AngleUnitsOptions);
      break;
    case ScatteringOptions.s:
      quantity = new S("r-nanometres", ReciprocalWavelengthUnitsOptions);
      break;
    default:
      quantity = new Q("r-nanometres", ReciprocalWavelengthUnitsOptions);
  }

  const handleQuantityChange = (event: SelectChangeEvent): void => {
    update({ selected: event.target.value as ScatteringOptions, units: })
  }

  const visibleRange = new NumericRange(
    quantity.fromQ(props.visableQRange.min),
    quantity.fromQ(props.visableQRange.max))

  const fullRange = new NumericRange(
    quantity.fromQ(props.visableQRange.min),
    quantity.fromQ(props.visableQRange.max))

  const requestedRange = new NumericRange(
    quantity.fromQ(requestedQRange.min),
    quantity.fromQ(requestedQRange.min),
  )

  const handleUnitChange = (event: SelectChangeEvent) => {
    update({ units: event.target.value })
  }
  console.log(Object.values(typeof quantity.units))

  const handleRequestedMaxRange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newRequestedMax = quantity.tooQ(parseFloat(event.target.value) ?? 0)
    update({ requestedRange: new NumericRange(requestedQRange.min, newRequestedMax) });
  }

  const handleRequestedMinRange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newRequestedMin = quantity.tooQ(parseFloat(event.target.value) ?? 0)
    update({ requestedRange: new NumericRange(newRequestedMin, requestedQRange.max,) });
  }

  return (
    <Box sx={{ flexGrow: 2 }}>
      <Card sx={{ height: 1 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <Typography>Scattering quantity: </Typography>
              <FormControl>
                <InputLabel>quantity</InputLabel>
                <Select
                  size="small"
                  value={selected}
                  label="units"
                  onChange={handleQuantityChange}
                >
                  <MenuItem value={ScatteringOptions.q}>
                    {ScatteringOptions.q}
                  </MenuItem>
                  <MenuItem value={ScatteringOptions.d}>
                    {ScatteringOptions.d}
                  </MenuItem>
                  <MenuItem value={ScatteringOptions.s}>
                    {ScatteringOptions.s}
                  </MenuItem>
                  <MenuItem value={ScatteringOptions.twoTheta}>
                    {ScatteringOptions.twoTheta}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>units</InputLabel>
                <Select
                  size="small"
                  value={units}
                  label="units"
                  onChange={handleUnitChange}
                >
                  <MenuItem value={quantity.unitOptions[0].value}>
                    {quantity.unitOptions[0].label}
                  </MenuItem>
                  <MenuItem value={quantity.unitOptions[1].value}>
                    {quantity.unitOptions[1].label}
                  </MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={2}>
                <Typography>
                  Min {selected} value: {visibleRange.min.toFixed(4)}{" "}
                </Typography>
                <Typography>
                  Max {selected} value: {visibleRange.max.toFixed(4)}
                </Typography>
              </Stack>
              <Box />
              <Stack spacing={2}>
                <Typography>Requested min {selected} value: </Typography>
                <Typography>Requested max {selected} value: </Typography>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  type="number"
                  size="small"
                  value={requestedRange.min}
                  onChange={handleRequestedMinRange}
                />
                <TextField
                  type="number"
                  size="small"
                  value={requestedRange.max}
                  onChange={handleRequestedMaxRange}
                />
              </Stack>
            </Stack>
            <RangeDiagram
              visibleQRange={visibleRange}
              fullQRange={fullRange}
              requestedRange={requestedRange}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
