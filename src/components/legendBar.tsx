import {
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    Typography,
} from "@mui/material";

export default function LegendBar(): JSX.Element {
    return (
        <Card sx={{ height: 1, width: 1 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6"> Legend</Typography>
                    <Typography>Add something to do with colors here</Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Detector" />
                        <FormControlLabel control={<Checkbox />} label="Beamstop" />
                        <FormControlLabel control={<Checkbox />} label="Camera tube" />
                        <FormControlLabel control={<Checkbox />} label="Q range" />
                        <FormControlLabel control={<Checkbox />} label="Mask" />
                        <FormControlLabel control={<Checkbox />} label="Calibrant" />
                    </FormGroup>
                    <Typography> Currently selected Calibrant is: {5}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
