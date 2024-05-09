import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDetectorStore } from "../data-entry/detectorStore";
import DetectorTable from "./detectorTable";
import CloseIcon from "@mui/icons-material/Close";
import { IODetector } from "../utils/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { createInternalDetector } from "../presets/presetManager";

interface DetectorForm {
  name: string;
  detector: IODetector;
}

export default function DetectorDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const detectorStore = useDetectorStore();
  const { register, reset, handleSubmit } = useForm<DetectorForm>();
  const onSubmit: SubmitHandler<DetectorForm> = (data: DetectorForm) => {
    detectorStore.addNewDetector(
      data.name,
      createInternalDetector(data.detector),
    );
    console.log(data);
    props.handleClose();
    reset();
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.handleClose}
      maxWidth={"md"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5"> Detectors </Typography>
          <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DetectorTable />
            <Divider />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="name"
                  {...register("name", { required: true })}
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
                  {...register("detector.resolution.width", { required: true })}
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
                  {...register("detector.resolution.height", {
                    required: true,
                  })}
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
                  label="width"
                  {...register("detector.pixelSize.width", { required: true })}
                  size="small"
                  inputProps={{
                    step: 0.000001,
                  }}
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
                  label="height"
                  {...register("detector.pixelSize.height", { required: true })}
                  size="small"
                  inputProps={{
                    step: 0.000001,
                  }}
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
          <Button variant="outlined" type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
