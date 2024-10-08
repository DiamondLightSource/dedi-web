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
      xl: 1536,
    },
  },
});

export default function App(): JSX.Element {
  return (
    <>
      <CssBaseline>
        <ThemeProvider theme={theme}>
          <Stack spacing={1}>
            <BasicAppBar />
            <Stack
              direction={{ md: "column", lg: "row" }}
              spacing={1}
              justifyContent={"center"}
            >
              <DataSideBar />
              <CentrePlot />
            </Stack>
          </Stack>
        </ThemeProvider>
      </CssBaseline>
    </>
  );
}
