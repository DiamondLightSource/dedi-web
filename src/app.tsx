import { Box, Stack } from "@mui/material";
import DataSideBar from "./data-entry/dataSideBar";
import ResultsBar from "./results/resultsBar";
import CentrePlot from "./plot/centrePlot";
import LegendBar from "./plot/legendBar";
import BasicAppBar from "./basicAppBar";

export default function App(): JSX.Element {
  return (
    <Box>
      <BasicAppBar />
      <Stack direction={"row"} spacing={1} margin={1}>
        <Box>
          <DataSideBar />
        </Box>
        <Stack direction={"column"} spacing={1} flexGrow={1}>
          <Stack direction={"row"} spacing={1}>
            <CentrePlot />
            <Box flexGrow={1}>
              <LegendBar />
            </Box>
          </Stack>
          <ResultsBar />
        </Stack>
      </Stack>
    </Box>
  );
}
