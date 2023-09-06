import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { Stack, Typography } from "@mui/material";

// Ad some config options here
export default function SideMenu() {
  return (
    <Box>
      <List>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Dark Mode</Typography>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Add New detector</Typography>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>View all detectors</Typography>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Save current config as preset</Typography>
          </Stack>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
}
