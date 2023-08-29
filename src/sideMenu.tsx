import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import { Button, Stack, Typography } from "@mui/material";

export default function SideMenu() {
  return (
    <Box>
      <List>
        <ListItem>
          <Stack direction="row">
            <Typography flexGrow={3}>Reset to default</Typography>
            <Button>Reset</Button>
          </Stack>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );
}
