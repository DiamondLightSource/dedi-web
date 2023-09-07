import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Autocomplete, Drawer, TextField } from "@mui/material";
import SideMenu from "./sideMenu";
import { useBeamlineConfigStore } from "./data-entry/beamlineconfigStore";
import { presetList } from "./presets/presetManager";
import { useBeamstopStore } from "./data-entry/beamstopStore";
import { useCameraTubeStore } from "./data-entry/cameraTubeStore";
import { useDetectorStore } from "./data-entry/detectorStore";

export default function BasicAppBar(): JSX.Element {
  const [state, setState] = React.useState({ menuOpen: false });
  const toggleDrawer = (open: boolean) => () => {
    setState({ menuOpen: open });
  };

  const preset = useBeamlineConfigStore((state) => state.preset);
  const updateBeamstop = useBeamstopStore((state) => state.updateBeamstop);
  const updateCameraTube = useCameraTubeStore(
    (state) => state.updateCameraTube,
  );
  const updateBeamlineConfig = useBeamlineConfigStore(
    (state) => state.update,
  );
  const updateDetector = useDetectorStore((state) => state.updateDetector);
  const handlePreset = (preset: string) => {
    const { beamstop, cameraTube, detector, ...beamlineConfig } =
      presetList[preset];
    updateDetector(detector);
    updateBeamstop(beamstop);
    updateCameraTube(cameraTube);
    updateBeamlineConfig(beamlineConfig);
    updateBeamlineConfig({ preset: preset });
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
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            options={Object.keys(presetList)}
            value={preset}
            sx={{ width: 300, color: "white" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="choose beamline preset"
                sx={{ color: "white" }}
              />
            )}
            onChange={(_, value) => {
              value ? handlePreset(value) : {};
            }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
