import { Box, Stack, } from "@mui/material";
import DataSideBar from "./components/dataSideBar";
import ResultsBar from "./components/resultsBar";
import CentrePlot from "./components/centrePlot";
import LegendBar from "./components/legendBar";


export default function App(): JSX.Element {

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Stack direction={'row'}>
        <DataSideBar />
        <Stack direction={'column'} flexGrow={2}>
          <Stack direction={'row'} flexGrow={2}>
            <CentrePlot />
            <LegendBar />
          </Stack>
          <ResultsBar />
        </Stack>
      </Stack>
    </Box>

  );
}
