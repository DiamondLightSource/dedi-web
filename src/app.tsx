import { Box, Stack, } from "@mui/material";
import DataSideBar from "./components/dataSideBar";


export default function App(): JSX.Element {

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Stack direction={'row'}>
        <DataSideBar />
        <Stack direction={'column'} flexGrow={1}>
          <Stack direction={'row'} flexGrow={1}>
            <DataSideBar />
            <DataSideBar />
          </Stack>
          <DataSideBar />
        </Stack>
      </Stack>
    </Box>

  );
}
