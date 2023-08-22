import { Box, Card, CardContent, Stack, Typography, Divider, Autocomplete, TextField, Button } from "@mui/material";
import { BeamlineConfig, DetectorType } from "../utils/types";


export default function DataSideBar(): JSX.Element {
    return (
        <Box sx={{ flexGrow: 1 }} >
            <Card sx={{ height: 1 }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="h6"> Configuration </Typography>
                        <Divider />
                        <Typography> Predefined Configuration Templates</Typography>
                        <Stack direction={"row"}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={Object.values(BeamlineConfig)}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="choose beamline config" />}
                            />
                        </Stack>
                        <Divider />
                        <Typography variant="h6">Detector</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={Object.values(DetectorType)}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="choose detector type" />}
                        />
                        <Typography>Resolution: 150x160</Typography>
                        <Stack direction="row">
                            <Typography flexGrow={2} >Pixel size</Typography>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={["mm", "mum"]}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="units" />}
                            />
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6">Beamstop</Typography>
                            <Stack direction={"row"}>
                                <Typography flexGrow={2}>Diameter: {4}</Typography>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={["mm", "mum"]}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="units" />}
                                />
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6">Position</Typography>
                            <Stack direction={"row"}>
                                <Typography flexGrow={2}>x:</Typography>
                                <Typography flexGrow={2} >px</Typography>
                            </Stack>
                            <Stack direction={"row"}>
                                <Typography flexGrow={2}>y:</Typography>
                                <Typography flexGrow={2} >px</Typography>
                            </Stack>
                            <Button>Centre detector</Button>
                            <Button>Centre top edge</Button>
                        </Stack>
                        <Divider />
                        <Typography variant="h6">Clearance</Typography>
                        <Typography flexGrow={2}>Diameter: {4}</Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={["mm", "mum"]}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="units" />}
                        />
                    </Stack>
                </CardContent>
            </Card>
        </Box >)
}