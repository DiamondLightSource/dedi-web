import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import BeamlineTable from "./BeamlineTable";
import CloseIcon from "@mui/icons-material/Close";
import { IOBeamline } from "../utils/types";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { createInternalBeamline } from "../presets/presetManager";
import { SubmitHandler, useForm } from "react-hook-form";
import { formatLogMessage, LengthUnits, WavelengthUnits } from "../utils/units";

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
  const { register, reset, handleSubmit } = useForm<BeamlineForm>();
  const onSubmit: SubmitHandler<BeamlineForm> = (data: BeamlineForm) => {
    beamlineConfigStore.addNewBeamline(
      data.name,
      createInternalBeamline(data.beamline),
    );
    console.info(formatLogMessage(`New detector created : ${data.name} `));
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
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5"> Beamlines </Typography>
          <Divider />
          <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={8}>
              <BeamlineTable />
            </Grid>
            <Grid item md={0} lg={1}></Grid>
            <Grid item xs={12} sm={12} md={12} lg={3}>
              <Stack spacing={1}>
                <Typography>Add New Beamline:</Typography>
                <Divider />
                <TextField
                  label="name"
                  {...register("name", { required: true })}
                  variant="outlined"
                  size="small"
                />
                <TextField
                  type="number"
                  label="min wavelength"
                  {...register("beamline.minWavelength", { required: true })}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {WavelengthUnits.nanometres}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="max wavelength "
                  variant="outlined"
                  size="small"
                  {...register("beamline.maxWavelength", { required: true })}
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {WavelengthUnits.nanometres}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="min camera length"
                  {...register("beamline.minCameraLength", { required: true })}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {LengthUnits.metre}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="max camera length"
                  variant="outlined"
                  size="small"
                  {...register("beamline.maxCameraLength", { required: true })}
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {LengthUnits.metre}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="camera length step"
                  {...register("beamline.cameraLengthStep", { required: true })}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {LengthUnits.metre}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="camera tube diameter"
                  variant="outlined"
                  {...register("beamline.cameratubeDiameter", {
                    required: true,
                  })}
                  size="small"
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {LengthUnits.millimetre}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  label="beamstop diamter"
                  {...register("beamline.beamstopDiameter", { required: true })}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    step: INPUT_PRECISION,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {LengthUnits.millimetre}
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="outlined">
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
