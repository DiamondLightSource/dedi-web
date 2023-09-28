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
import { AngleUnits } from "../utils/units";
import React from "react";
import { useResultStore } from "./resultsStore";
import NumericRange from "../calculations/numericRange";
import RangeDiagram from "./rangeDiagram";
import { ScatteringQuantity } from "./scatteringQuantities";

export default function ResultsBar(props: {
  visableQRange: NumericRange;
  fullQrange: NumericRange;
}): JSX.Element {
  const [angleUnits, setAngleUnits] = React.useState<AngleUnits>(
    AngleUnits.radians,
  );

  const handleAngleUnits = (event: SelectChangeEvent) => {
    setAngleUnits(event.target.value as AngleUnits);
  };
  const [quantity, setQuantity] = React.useState<ScatteringQuantity>(
    ScatteringQuantity.q,
  );

  const handleQuantity = (event: SelectChangeEvent) => {
    setQuantity(event.target.value as ScatteringQuantity);
  };

  const resultStore = useResultStore();
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
                  value={quantity}
                  label="units"
                  onChange={handleQuantity}
                >
                  <MenuItem value={ScatteringQuantity.q}>
                    {ScatteringQuantity.q}
                  </MenuItem>
                  <MenuItem value={ScatteringQuantity.d}>
                    {ScatteringQuantity.d}
                  </MenuItem>
                  <MenuItem value={ScatteringQuantity.s}>
                    {ScatteringQuantity.s}
                  </MenuItem>
                  <MenuItem value={ScatteringQuantity.twoTheta}>
                    {ScatteringQuantity.twoTheta}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>units</InputLabel>
                <Select
                  size="small"
                  value={angleUnits}
                  label="units"
                  onChange={handleAngleUnits}
                >
                  <MenuItem value={AngleUnits.radians}>rad</MenuItem>
                  <MenuItem value={AngleUnits.degrees}>deg</MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={2}>
                <Typography>
                  Min {quantity} value: {props.visableQRange.min.toFixed(4)}{" "}
                </Typography>
                <Typography>
                  Max {quantity} value: {props.visableQRange.max.toFixed(4)}
                </Typography>
              </Stack>
              <Box />
              <Stack spacing={2}>
                <Typography>Requested min {quantity} value: </Typography>
                <Typography>Requested max {quantity} value: </Typography>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  type="number"
                  size="small"
                  value={resultStore.requestedRange.min}
                  onChange={(event) => {
                    resultStore.update({
                      requestedRange: new NumericRange(
                        parseFloat(event.target.value) ?? 0,
                        resultStore.requestedRange.max,
                      ),
                    });
                  }}
                />
                <TextField
                  type="number"
                  size="small"
                  value={resultStore.requestedRange.max}
                  onChange={(event) => {
                    resultStore.update({
                      requestedRange: new NumericRange(
                        resultStore.requestedRange.min,
                        parseFloat(event.target.value) ?? 0,
                      ),
                    });
                  }}
                />
              </Stack>
            </Stack>
            <RangeDiagram
              visibleQRange={props.visableQRange}
              fullQRange={props.fullQrange}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
