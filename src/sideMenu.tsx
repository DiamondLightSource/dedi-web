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
            <Typography flexGrow={3}>{"Nothing to see here (0_0)"}</Typography>
          </Stack>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
}
