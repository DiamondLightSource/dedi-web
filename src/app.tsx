import { Stack } from "@mui/material";
import DataSideBar from "./data-entry/dataSideBar";
import CentrePlot from "./plot/centrePlot";
import BasicAppBar from "./basicAppBar";

export default function App(): JSX.Element {
  return (
    <>
      <BasicAppBar />
      <Stack direction={"row"} spacing={1} margin={1}>
        <DataSideBar />
        <Stack direction={"column"} spacing={1} flexGrow={1}>
          <CentrePlot />
        </Stack>
      </Stack>
    </>
  );
}
