import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { Stack, Typography } from "@mui/material";

export default function SideMenu() {
  return (
    <Box>
      <List>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Add New detector</Typography>
          </Stack>
        </ListItem>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Add New detector</Typography>
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
