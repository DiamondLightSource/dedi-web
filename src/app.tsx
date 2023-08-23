import { Box, Stack } from "@mui/material";
import DataSideBar from "./components/dataSideBar";
import ResultsBar from "./components/resultsBar";
import CentrePlot from "./components/centrePlot";
import LegendBar from "./components/legendBar";

export default function App(): JSX.Element {
  return (
    <Box margin={1}>
      <Stack direction={"row"} spacing={1}>
        <Box maxWidth={"40vw"} maxHeight={"92vh"}>
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
