import { Box, Stack, } from "@mui/material";
import DataSideBar from "./components/dataSideBar";
import ResultsBar from "./components/resultsBar";
import CentrePlot from "./components/centrePlot";
import LegendBar from "./components/legendBar";


export default function App(): JSX.Element {

  return (
    <Box sx={{ width: 1, height: 1 }} margin={1} >
      <Stack direction={'row'} spacing={1}>
        <DataSideBar />
        <Stack direction={'column'} flexGrow={1} spacing={1}>
          <Stack direction={'row'} flexGrow={1} spacing={1}>
            <CentrePlot />
            <LegendBar />
          </Stack>
          <ResultsBar />
        </Stack>
      </Stack>
    </Box >

  );
}
