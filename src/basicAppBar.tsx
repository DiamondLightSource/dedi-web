import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import SideMenu from "./sideMenu";

export default function BasicAppBar(): JSX.Element {
  const [state, setState] = React.useState({ menuOpen: false });
  const toggleDrawer = (open: boolean) => () => {
    setState({ menuOpen: open });
  };

  return (
    <Box sx={{ flexGrow: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <React.Fragment>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={state.menuOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
              >
                {<SideMenu />}
              </Box>
            </Drawer>
          </React.Fragment>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dedi Web
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
