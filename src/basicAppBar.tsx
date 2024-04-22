import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";

export default function BasicAppBar(): JSX.Element {
  const [state, setState] = React.useState({ menuOpen: false });
  const toggleDrawer = (open: boolean) => () => {
    setState({ menuOpen: open });
  };

  return (
    <Box >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dedi Web
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
