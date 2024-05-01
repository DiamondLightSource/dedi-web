import { beamlineRecord } from "../presets/presetManager";
import { AppBeamline} from "../utils/types"
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

interface BeamlineTableRow {
  name: string
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
  cameraLengthStep: number;
}

function createData( name: string, beamline: AppBeamline): BeamlineTableRow {
  return {
    name: name,
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
    { field: "minWavelength", headerName: "min wavelength", flex: 1 },
    { field: "maxWavelength", headerName: "max wavelength", flex: 1 },
    { field: "minCameraLength", headerName: "min camera length", flex: 1 },
    { field: "maxCameraLength", headerName: "max camera length", flex: 1 },
    { field: "cameraLengthStep", headerName: "camera length step", flex: 1 },
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
