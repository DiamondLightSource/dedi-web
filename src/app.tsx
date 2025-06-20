import { Stack, ThemeProvider, createTheme } from "@mui/material";
import DataSideBar from "./data-entry/dataSideBar";
import CentrePlot from "./plot/centrePlot";
import BasicAppBar from "./basicAppBar";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
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
            sx={{ pt: "70px" }}
          >
            <DataSideBar />
            <CentrePlot />
          </Stack>
        </ThemeProvider>
      </CssBaseline>
    </>
  );
}
