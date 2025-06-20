import { IOBeamline } from "../../utils/types";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useBeamlineConfigStore } from "../../data-entry/beamlineconfigStore";

interface AppConfigTableRow {
  name: string;
  detector: string;
  beamstopDiameter: number;
  cameraTubeDiameter?: number;
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
  cameraLengthStep: number;
}

function createData(name: string, appConfig: IOBeamline): AppConfigTableRow {
  return {
    name: name,
    detector: appConfig.detector,
    beamstopDiameter: appConfig.beamstop.diameter,
    cameraTubeDiameter: appConfig.cameraTube?.diameter,
    minWavelength: appConfig.wavelengthLimits.min,
    maxWavelength: appConfig.wavelengthLimits.max,
    minCameraLength: appConfig.cameraLengthLimits.min,
    maxCameraLength: appConfig.cameraLengthLimits.max,
    cameraLengthStep: appConfig.cameraLengthLimits.step,
  };
}

export default function AppConfigTable(): React.JSX.Element {
  const displayArray: AppConfigTableRow[] = [];
  const presetConfigRecord = useBeamlineConfigStore(
    (state) => state.presetRecord,
  );
  for (const [key, value] of Object.entries(presetConfigRecord)) {
    displayArray.push(createData(key, value));
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "name", flex: 1 },
    { field: "detector", headerName: "detector", flex: 1 },
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
      getRowId={(row: AppConfigTableRow) => row.name}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      sx={{ border: 0 }}
      disableSelectionOnClick
    />
  );
}
