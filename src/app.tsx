import { Stack} from "@mui/material";
import DataSideBar from "./data-entry/dataSideBar";
import CentrePlot from "./plot/centrePlot";
import BasicAppBar from "./basicAppBar";
import CssBaseline from '@mui/material/CssBaseline';


export default function App(): JSX.Element {
  return (
    <>
    <CssBaseline>
      <Stack spacing={1}>
      <BasicAppBar />
      <Stack 
          direction={{md: "column", lg:"row"}}
          spacing={1}
          justifyContent={"center"}
        >
        <DataSideBar/>
        <CentrePlot />
      </Stack>
      </Stack>
    </CssBaseline>
    </>
  );
}
