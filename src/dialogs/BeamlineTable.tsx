import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { AppBeamline } from "../utils/types";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { LengthUnits, WavelengthUnits } from "../utils/units";

interface BeamlineTableRow {
  name: string;
  cameraTubeDiameter: number;
  beamstopDiameter: number;
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
  cameraLengthStep: number;
}

function createData(name: string, beamline: AppBeamline): BeamlineTableRow {
  return {
    name: name,
    cameraTubeDiameter: beamline.cameratubeDiameter,
    beamstopDiameter: beamline.beamstopDiameter,
    minWavelength: beamline.minWavelength.toNumber(WavelengthUnits.nanometres),
    maxWavelength: beamline.maxWavelength.toNumber(WavelengthUnits.nanometres),
    minCameraLength: beamline.minCameraLength.toNumber(LengthUnits.metre),
    maxCameraLength: beamline.maxCameraLength.toNumber(LengthUnits.metre),
    cameraLengthStep: beamline.cameraLengthStep.toNumber(LengthUnits.metre),
  };
}

export default function BeamlineTable() {
  const beamlineConfigStore = useBeamlineConfigStore();
  const displayArray: BeamlineTableRow[] = [];
  for (const [key, value] of Object.entries(
    beamlineConfigStore.beamlineRecord,
  )) {
    displayArray.push(createData(key, value));
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "name", flex: 1 },
    {
      field: "beamstopDiameter",
      headerName: "Beamstop Diameter (mm)",
      flex: 1,
    },
    {
      field: "cameraTubeDiameter",
      headerName: "CameraTube Diameter (mm)",
      flex: 1,
    },
    { field: "minWavelength", headerName: "Min wavelength (nm)", flex: 1 },
    { field: "maxWavelength", headerName: "Max wavelength (nm)", flex: 1 },
    { field: "minCameraLength", headerName: "Min camera length (m)", flex: 1 },
    { field: "maxCameraLength", headerName: "Max camera length (m)", flex: 1 },
    {
      field: "cameraLengthStep",
      headerName: "Camera length step (m)",
      flex: 1,
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={displayArray}
      getRowId={(row: BeamlineTableRow) => row.name}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      sx={{ border: 0 }}
      disableSelectionOnClick
    />
  );
}
