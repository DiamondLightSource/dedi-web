import {
    Stack,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Input,
    Button,
    ButtonGroup,
    TextField,
} from "@mui/material";
import {
    DistanceUnits,
} from "../utils/units";
import { useDispatch, useSelector } from "react-redux";
import {
    configSelector,
    beamstopSelector,
} from "./configSlice";
import { editUnits, unitSelector } from "./unitSlice";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { ChangeEvent } from "react";

export default function BeamStopDataEntry(): JSX.Element {
    const beamstopDiameter = useSelector(beamstopSelector);
    const units = useSelector(unitSelector);
    const dispatch = useDispatch();
    const config = useSelector(configSelector);

    return (
        <Stack spacing={2}>
            <Typography variant="h6" > Beamstop </Typography>
            < Stack direction={"row"} >
                <Typography flexGrow={2}> Diameter: {beamstopDiameter} </Typography>
                < FormControl >
                    <InputLabel>units </InputLabel>
                    < Select
                        size="small"
                        value={units.beamstopDiameterUnits}
                        label="units"
                        onChange={(event) =>
                            dispatch(
                                editUnits({
                                    beamstopDiameterUnits: event.target
                                        .value as DistanceUnits,
                                }),
                            )
                        }
                    >
                        <MenuItem value={DistanceUnits.millimetre}>
                            {DistanceUnits.millimetre}
                        </MenuItem>
                        < MenuItem value={DistanceUnits.micrometre} >
                            {DistanceUnits.micrometre}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Typography >Position:</Typography>
            <Stack direction={"row"}>
                <Typography flexGrow={2}>x: </Typography>
                <TextField size="small" defaultValue={""}  />
                <Typography flexGrow={2}> px</Typography>
                <Button size="small">Centre detector</Button>
            </Stack>
            <Stack direction={"row"}>
                <Typography flexGrow={2}>y: </Typography>
                <Input size="small" value={config.cameraTube.centre.y} />
                <Typography flexGrow={2}> px</Typography>
                <Button size="small">Centre top edge</Button>
            </Stack>
            <Stack direction="row">
                <Stack direction="row" spacing={2}>
                    <Typography flexGrow={1}>Clearance: </Typography>
                    <ButtonGroup>
                        <Input size="small" value={config.clearance} />
                        <Button size="small">
                            <RemoveIcon fontSize="small" />
                        </Button>
                        <Button size="small">
                            <AddIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
                    <Typography flexGrow={1}>pixels</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}
