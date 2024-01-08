import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material"

export default function DetectorDialog(props: { open: boolean, handleClose: () => void, handleOpen: () => void }): JSX.Element {
    return (
        <Dialog
            open={props.open}
            keepMounted
            onClose={props.handleClose}
        >
            <DialogTitle>{"Add a new detector"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Divider />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography>Resolution:</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>w:</Typography>
                        </Grid>
                        <Grid item xs={3} >
                            <TextField
                                type="number"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>h:</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Typography > Pixel Size {"\(mm\)"}:</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>x:</Typography>
                        </Grid>
                        <Grid item xs={3} >
                            <TextField
                                type="number"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography>y:</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="outlined">Submit</Button>
            </DialogActions>
        </Dialog>
    )
}