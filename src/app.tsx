import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
import CentrePlot from "./plot/centrePlot";
import BasicAppBar from "./basicAppBar";
import CssBaseline from "@mui/material/CssBaseline";
import CameraTubeDataEntry from "./data-entry/cameraTube";
import BeamStopDataEntry from "./data-entry/beamstop";
import DetectorDataEntry from "./data-entry/detector";
import BeamlineSelector from "./data-entry/beamlineSelector";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1500,
      xl: 1600,
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <>
      <CssBaseline>
        <ThemeProvider theme={theme}>
          <BasicAppBar />
          <Stack
            direction={{ sm: "column", lg: "row" }}
            spacing={1}
            justifyContent={"center"}
            overflow={"clip"}
            sx={{ pt: "70px" , mr:1, ml:1 }}
          >
            <Box
                  maxHeight={{ lg: "calc(100vh - 70px)" }}
                  maxWidth={{ lg: 500 }}
                  overflow={{ md: "visible", lg: "scroll" }} 
                >
                  <Stack spacing={1} sx={{ mt:1, mb:1 }}>
                    <BeamlineSelector />
                    <DetectorDataEntry />
                    <BeamStopDataEntry />
                    <CameraTubeDataEntry />
                  </Stack>
                </Box>
            <CentrePlot />
          </Stack>
        </ThemeProvider>
      </CssBaseline>
    </>
  );
}
