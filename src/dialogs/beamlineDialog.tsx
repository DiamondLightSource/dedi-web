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
  IconButton,
  Typography,
} from "@mui/material";
import BeamlineTable from "./BeamlineTable";
import CloseIcon from '@mui/icons-material/Close';
import { IOBeamline } from "../utils/types";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { createInternalBeamline } from "../presets/presetManager";
import { SubmitHandler, useForm } from "react-hook-form";

const GRID_ITEM_SIZE = 3;
const INPUT_PRECISION = 0.000001;

interface BeamlineForm {
  name: string;
  beamline: IOBeamline;
}


export default function PresetDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const beamlineConfigStore = useBeamlineConfigStore();
  const { register, handleSubmit } = useForm<BeamlineForm>();
  const onSubmit: SubmitHandler<BeamlineForm> = (data: BeamlineForm) => {
    beamlineConfigStore.addNewBeamline(
      data.name, createInternalBeamline(data.beamline));
    console.log(data);
    props.handleClose();
    reset();
  };
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xl"}
      open={props.open}
      keepMounted
      onClose={props.handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5"> Beamlines </Typography>
        <IconButton onClick={props.handleClose} sx={{ ml: 'auto' }}>
            <CloseIcon />
        </IconButton>
        </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <BeamlineTable />
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                label="name"
                {...register("name", {required: true})}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="min wavelength"
                {...register("beamline.minWavelength", {required: true})}
                variant="outlined"
                size="small"
                inputProps={{
                  step: INPUT_PRECISION,
                }}
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
                {...register("beamline.minCameraLength", {required: true})}
                variant="outlined"
                size="small"
                inputProps={{
                  step: INPUT_PRECISION,
                }}
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
                {...register("beamline.cameraLengthStep", {required: true})}
                variant="outlined"
                size="small"
                inputProps={{
                  step: INPUT_PRECISION,
                }}
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
                size="small"
                {...register("beamline.maxWavelength", {required: true})}
                inputProps={{
                  step: INPUT_PRECISION,
                }}
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
                size="small"
                {...register("beamline.maxCameraLength", {required: true})}
                inputProps={{
                  step: INPUT_PRECISION,
                }}
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
                label="camera tube diameter"
                variant="outlined"
                {...register("beamline.cameratubeDiameter", {required: true})}
                size="small"
                inputProps={{
                  step: INPUT_PRECISION,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                  ),
                }}
              />
              </Grid>
              <Grid item xs={GRID_ITEM_SIZE}>
              <TextField
                type="number"
                label="beamstop diamter"
                {...register("beamline.beamstopDiameter", {required: true})}
                variant="outlined"
                size="small"
                inputProps={{
                  step: INPUT_PRECISION,
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
        <Button type="submit" variant="outlined">Submit</Button>
      </DialogActions>
      </form>
    </Dialog>
  );
}
