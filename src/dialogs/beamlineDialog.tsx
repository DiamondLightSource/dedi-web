import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import BeamlineTable from "./BeamlineTable";

const GRID_ITEM_SIZE = 4;

export default function PresetDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const [name, setName] = React.useState<string>();
  const [minWavelength, setMinWavelength] = React.useState<number>();
  const [maxWavelength, setMaxwavelength] = React.useState<number>();
  const [minCameraLength, setMinCameraLength] = React.useState<number>();
  const [maxCameraLangth, setMaxCameraLangth] = React.useState<number>();
  const [cameraLengthStep, setCameraLengthStep] = React.useState<number>();

  const handleSubmit = () => {
    props.handleClose();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xl"}
      open={props.open}
      keepMounted
      onClose={props.handleClose}
    >
      <DialogTitle>{"Beamlines"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <BeamlineTable />
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                label="name"
                value={name}
                variant="outlined"
                size="small"
                onChange={(event) => setName(event.target.value)}
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="min wavelength"
                variant="outlined"
                value={minWavelength}
                size="small"
                onChange={(event) =>
                  setMinWavelength(parseFloat(event.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">nm</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="min camera length"
                value={minCameraLength}
                variant="outlined"
                size="small"
                onChange={(event) =>
                  setMinCameraLength(parseFloat(event.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="camera length step"
                value={cameraLengthStep}
                variant="outlined"
                size="small"
                onChange={(event) =>
                  setCameraLengthStep(parseFloat(event.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="max wavelength "
                variant="outlined"
                value={maxWavelength}
                size="small"
                onChange={(event) =>
                  setMaxwavelength(parseFloat(event.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">nm</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="max camera length"
                variant="outlined"
                value={maxCameraLangth}
                size="small"
                onChange={(event) =>
                  setMaxCameraLangth(parseFloat(event.target.value))
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="outlined">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
