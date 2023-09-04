import {
    Stack,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import { AngleUnits, EnergyUnits, WavelengthUnits } from "../utils/units";
import { useBeamlineConfigStore } from "./beamlineconfigStore";

export default function BeampropertiesDataEntry() {
    const minWavelength = useBeamlineConfigStore((state) => {
        if (
            state.wavelengthUnits === WavelengthUnits.angstroms
        ) {
            return state.maxWavelength * 10;
        }
        return state.maxWavelength;
    });

    const maxWavelength = useBeamlineConfigStore((state) => {
        if (
            state.wavelengthUnits === WavelengthUnits.angstroms
        ) {
            return state.maxWavelength * 10;
        }
        return state.maxWavelength;
    });

    const cameraLength = useBeamlineConfigStore((state) => state.cameraLength);
    const minCameraLength = useBeamlineConfigStore((state) => state.minCameraLength);
    const maxCameraLength = useBeamlineConfigStore((state) => state.maxCameraLength);


    const energy = useBeamlineConfigStore((state) => {
        if (state.energy && state.beamEnergyUnits === EnergyUnits.electronVolts) {
            return 1000 * state.energy;
        }
        return state.energy;
    });
    const energyUnits = useBeamlineConfigStore((state) => state.beamEnergyUnits);
    const updateEnergyUnits = useBeamlineConfigStore(
        (state) => state.updateEnergyUnits,
    );
    const updateEnergy = useBeamlineConfigStore((state) => state.updateEnergy);
    const handleEnergy = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (energyUnits === EnergyUnits.electronVolts && event.target.value) {
            updateEnergy(parseFloat(event.target.value) / 1000);
        } else {
            updateEnergy(parseFloat(event.target.value));
        }
    };

    const angle = useBeamlineConfigStore((state) => {
        if (state.angle && state.angleUnits === AngleUnits.degrees) {
            return state.angle * (180 / Math.PI);
        }
        return state.angle;
    });
    const angleUnits = useBeamlineConfigStore((state) => state.angleUnits);
    const updateAngleUnits = useBeamlineConfigStore(
        (state) => state.updateAngleUnits,
    );
    const updateAngle = useBeamlineConfigStore((state) => state.updateAngle);
    const handleAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (angleUnits === AngleUnits.degrees && event.target.value) {
            updateAngle(parseFloat(event.target.value) / (180 / Math.PI));
        } else {
            updateAngle(parseFloat(event.target.value));
        }
    };

    const wavelength = useBeamlineConfigStore((state) => {
        if (
            state.wavelength &&
            state.wavelengthUnits === WavelengthUnits.angstroms
        ) {
            return state.wavelength * 10;
        }
        return state.wavelength;
    });

    const wavelengthUnits = useBeamlineConfigStore(
        (state) => state.wavelengthUnits,
    );
    const updateWavelengthUnits = useBeamlineConfigStore(
        (state) => state.updateWavelengthUnits,
    );
    const updateWavelength = useBeamlineConfigStore(
        (state) => state.updateWavelength,
    );
    const handleWavelength = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (wavelengthUnits === WavelengthUnits.angstroms && event.target.value) {
            updateWavelength(parseFloat(event.target.value) / 10);
        } else {
            updateWavelength(parseFloat(event.target.value));
        }
    };

    const updateCameraLength = useBeamlineConfigStore((state) => state.updateCameraLength);
    const handleCameraLength = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateCameraLength(parseFloat(event.target.value) ? parseFloat(event.target.value) : null);

    };

    return (
        <Stack spacing={2}>
            <Typography variant="h6">Beam properties</Typography>
            <Stack direction={"row"} spacing={2}>
                <Typography flexGrow={1}>Energy: </Typography>
                <TextField
                    type="number"
                    size="small"
                    value={energy ?? ""}
                    onChange={handleEnergy}
                />
                <FormControl>
                    <InputLabel>units</InputLabel>
                    <Select
                        size="small"
                        label="units"
                        value={energyUnits}
                        onChange={(event) =>
                            updateEnergyUnits(event.target.value as EnergyUnits)
                        }
                    >
                        <MenuItem value={EnergyUnits.electronVolts}>
                            {EnergyUnits.electronVolts}
                        </MenuItem>
                        <MenuItem value={EnergyUnits.kiloElectronVolts}>
                            {EnergyUnits.kiloElectronVolts}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Stack direction={"row"} spacing={2}>
                <Typography flexGrow={1}>WaveLength: </Typography>
                <TextField
                    type="number"
                    size="small"
                    value={wavelength ?? ""}
                    onChange={handleWavelength}
                />
                <FormControl>
                    <InputLabel>units</InputLabel>
                    <Select
                        size="small"
                        label="units"
                        value={wavelengthUnits}
                        onChange={(event) =>
                            updateWavelengthUnits(event.target.value as WavelengthUnits)
                        }
                    >
                        <MenuItem value={WavelengthUnits.nanmometres}>
                            {WavelengthUnits.nanmometres}
                        </MenuItem>
                        <MenuItem value={WavelengthUnits.angstroms}>
                            {WavelengthUnits.angstroms}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <Typography>Minimum allowed wavelength: {minWavelength} {wavelengthUnits} </Typography>
            <Typography>Maximum allowed wavelength: {maxWavelength} {wavelengthUnits}</Typography>
            <Stack direction="row" spacing={2}>
                <Typography>Camera Length: </Typography>
                <TextField
                    type="number"
                    size="small"
                    value={cameraLength ?? ""}
                    InputProps={{
                        inputProps: {
                            max: maxCameraLength, min: minCameraLength
                        }
                    }}
                    onChange={handleCameraLength}
                />
                <Typography>m</Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
                <Typography flexGrow={2}>Angle:</Typography>
                <TextField type="number" size="small" defaultValue={""} value={angle ?? ""} onChange={handleAngle} />
                <FormControl>
                    <InputLabel>units</InputLabel>
                    <Select
                        size="small"
                        label="units"
                        value={angleUnits}
                        onChange={(event) =>
                            updateAngleUnits(event.target.value as AngleUnits)
                        }
                    >
                        <MenuItem value={AngleUnits.radians}>{AngleUnits.radians}</MenuItem>
                        <MenuItem value={AngleUnits.degrees}>{AngleUnits.degrees}</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Stack>
    );
}
