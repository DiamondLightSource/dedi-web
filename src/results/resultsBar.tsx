import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import NumericRange from "../calculations/numericRange";
import { useResultStore } from "./resultsStore";



export default function ResultsBar(props: {
  visableQRange: NumericRange;
  fullQrange: NumericRange;
}): JSX.Element {
  const quantityQ = useResultStore(state => state.q);
  const quantityS = useResultStore(state => state.s);
  const quantityD = useResultStore(state => state.d);
  const quantityTheta = useResultStore(state => state.twoTheta);

  return (
    <Box sx={{ flexGrow: 2 }}>
      <Card sx={{ height: 1 }}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6"> Results</Typography>
            <Divider />
            <Stack direction={"row"} spacing={3}>
              <Box flexGrow={1}>
                <Grid container spacing={0} columns={8}>
                  <Grid xs={2}>
                    <Typography>Values</Typography>
                    <Divider />
                    <Typography>q</Typography>
                    <Divider />
                    <Typography>s</Typography>
                    <Divider />
                    <Typography>d</Typography>
                    <Divider />
                    <Typography>twoTheta</Typography>
                  </Grid>
                  <Grid xs={2}>
                    <Typography>Min</Typography>
                    <Divider />
                    <Typography>{quantityQ.fromQ(props.visableQRange.min).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityS.fromQ(props.visableQRange.min).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityD.fromQ(props.visableQRange.min).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityTheta.fromQ(props.visableQRange.min).toFixed(4)}</Typography>
                  </Grid>
                  <Grid xs={2}>
                    <Typography>Max</Typography>
                    <Divider />
                    <Typography>{quantityQ.fromQ(props.visableQRange.max).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityS.fromQ(props.visableQRange.max).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityD.fromQ(props.visableQRange.max).toFixed(4)}</Typography>
                    <Divider />
                    <Typography>{quantityTheta.fromQ(props.visableQRange.max).toFixed(4)}</Typography>
                  </Grid>
                  <Grid xs={2}>
                    <Typography>Units</Typography>
                    <FormControl>
                      <InputLabel>q</InputLabel>
                      <Select
                        size="small"
                        label="units"
                      >
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Divider orientation="vertical" />
              <Box flexGrow={2}>
                <Typography>Other side</Typography>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box >
  );
}
