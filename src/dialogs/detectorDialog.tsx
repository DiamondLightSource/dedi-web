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
  Typography,
} from "@mui/material";
import React from "react";
import { useDetectorStore } from "../data-entry/detectorStore";
import * as mathjs from "mathjs";
import DetectorTable from "./detectorTable";

export default function DetectorDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const detectorStore = useDetectorStore();
  const [resolutionHeight, setResolutionHeight] = React.useState<number>();
  const [resolutionWidth, setResolutionWidth] = React.useState<number>();
  const [pixelHeight, setPixelHeight] = React.useState<number>();
  const [pixelWidth, setPixelWidth] = React.useState<number>();
  const [name, setName] = React.useState<string>();

  const handleSubmit = () => {
    if (
      resolutionHeight &&
      resolutionWidth &&
      pixelHeight &&
      pixelWidth &&
      name
    ) {
      detectorStore.addNewDetector(name, {
        resolution: { height: resolutionHeight, width: resolutionWidth },
        pixelSize: {
          height: mathjs.unit(pixelHeight, "mm"),
          width: mathjs.unit(pixelWidth, "mm"),
        },
      });
    }

    props.handleClose();
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.handleClose}
      maxWidth={"md"}
    >
      <DialogTitle>{"Detectors"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Divider />
          <DetectorTable />
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="name"
                onChange={(event) => setName(event.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <Typography>Resolution:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="width"
                onChange={(event) =>
                  setResolutionWidth(parseFloat(event.target.value))
                }
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="height"
                onChange={(event) =>
                  setResolutionHeight(parseFloat(event.target.value))
                }
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">px</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography> Pixel Size:</Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="x"
                onChange={(event) =>
                  setPixelWidth(parseFloat(event.target.value))
                }
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                type="number"
                label="y"
                onChange={(event) =>
                  setPixelHeight(parseFloat(event.target.value))
                }
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
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
