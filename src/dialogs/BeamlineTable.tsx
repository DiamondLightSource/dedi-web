import { beamlineRecord } from "../presets/presetManager";
import { AppBeamline} from "../utils/types"
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface BeamlineTableRow {
  name: string
  cameraTubeDiameter: number;
  beamstopDiameter: number;
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
  cameraLengthStep: number;
}

function createData( name: string, beamline: AppBeamline): BeamlineTableRow {
  return {
    name: name,
    cameraTubeDiameter: beamline.cameratubeDiameter,
    beamstopDiameter: beamline.beamstopDiameter,
    minWavelength: beamline.minWavelength.toNumber("nm"),
    maxWavelength: beamline.maxWavelength.toNumber("nm"),
    minCameraLength: beamline.minCameraLength.toNumber("m"),
    maxCameraLength: beamline.maxCameraLength.toNumber("m"),
    cameraLengthStep: beamline.cameraLengthStep.toNumber("m"),
  };
}

export default function BeamlineTable() {
  const displayArray: BeamlineTableRow[] = [];
  for (const [key, value] of Object.entries(beamlineRecord)) {
    displayArray.push(createData(key, value));
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "name", flex: 1 },
    { field: "beamstopDiameter",
      headerName: "Beamstop Diameter (mm)", flex: 1 },
    { field: "cameraTubeDiameter",
      headerName: "CameraTube Diameter (mm)", flex: 1 },
    { field: "minWavelength", headerName: "Min wavelength (nm)", flex: 1 },
    { field: "maxWavelength", headerName: "Max wavelength (nm)", flex: 1 },
    { field: "minCameraLength", headerName: "Min camera length (m)", flex: 1 },
    { field: "maxCameraLength", headerName: "Max camera length (m)", flex: 1 },
    { field: "cameraLengthStep", 
      headerName: "Camera length step (m)", flex: 1 },
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
