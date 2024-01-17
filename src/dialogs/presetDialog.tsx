import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
} from "@mui/material";

export default function PresetDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const handleSubmit = () => {
    props.handleClose();
  };
  return (
    <Dialog open={props.open} keepMounted onClose={props.handleClose}>
      <DialogTitle>{"Add new Beamline config"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Divider />
          <TextField
            id="outlined-basic"
            label="name"
            variant="outlined"
            size="small"
          />
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
