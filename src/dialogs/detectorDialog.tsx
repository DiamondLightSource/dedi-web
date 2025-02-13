import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
  const { register, reset, handleSubmit, setValue } = useForm<DetectorForm>();
  const onSubmit: SubmitHandler<DetectorForm> = (data: DetectorForm) => {
    detectorStore.addNewDetector(
      data.name,
      createInternalDetector(data.detector),
    );
    console.log(data);
    props.handleClose();
    reset();
  };
  setValue("detector.mask.missingModules", []);

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.handleClose}
      maxWidth={"xl"}
      fullWidth={true}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5"> Detectors </Typography>
          <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={8}>
              <DetectorTable />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4}>
              <Stack spacing={1} width={"100%"}>
                <Typography>Add new Detector:</Typography>
                <TextField
                  label="name"
                  {...register("name", { required: true })}
                  variant="outlined"
                  size="small"
                />
                <Typography>Resolution:</Typography>
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
                <Typography> Pixel Size:</Typography>
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
                <Typography> Mask: </Typography>
                <TextField
                  type="number"
                  label="Horizontal Modules"
                  {...register("detector.mask.horizontalModules", {
                    required: true,
                  })}
                  size="small"
                  inputProps={{
                    step: 1,
                  }}
                />
                <TextField
                  type="number"
                  label="Vertical Modules"
                  {...register("detector.mask.verticalModules", {
                    required: true,
                  })}
                  size="small"
                  inputProps={{
                    step: 1,
                  }}
                />
                <TextField
                  type="number"
                  label="Horizontal Gap"
                  {...register("detector.mask.horizontalGap", {
                    required: true,
                  })}
                  size="small"
                  inputProps={{
                    step: 1,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">px</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="Vertical Gap"
                  {...register("detector.mask.verticalGap", { required: true })}
                  size="small"
                  inputProps={{
                    step: 1,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">px</InputAdornment>
                    ),
                  }}
                />
                <Button variant="outlined" type="submit">
                  Submit
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </form>
    </Dialog>
  );
}
