import { IOBeamline } from "../../utils/types";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useBeamlineConfigStore } from "../../data-entry/beamlineconfigStore";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

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
  const beamlineConfigStore = useBeamlineConfigStore();
  const presetConfigRecord = beamlineConfigStore.presetRecord;
  for (const [key, value] of Object.entries(presetConfigRecord)) {
    displayArray.push(createData(key, value));
  }

  const userNames = new Set(Object.keys(beamlineConfigStore.userPresetRecord));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "detector", headerName: "Detector", flex: 1 },
    {
      field: "beamstopDiameter",
      headerName: "BS ⌀ (mm)",
      description: "Beamstop diameter (mm)",
      flex: 1,
    },
    {
      field: "cameraTubeDiameter",
      headerName: "CT ⌀ (mm)",
      description: "Camera tube diameter (mm)",
      flex: 1,
    },
    {
      field: "minWavelength",
      headerName: "λ min (nm)",
      description: "Minimum wavelength (nm)",
      flex: 1,
    },
    {
      field: "maxWavelength",
      headerName: "λ max (nm)",
      description: "Maximum wavelength (nm)",
      flex: 1,
    },
    {
      field: "minCameraLength",
      headerName: "L min (m)",
      description: "Minimum camera length (m)",
      flex: 1,
    },
    {
      field: "maxCameraLength",
      headerName: "L max (m)",
      description: "Maximum camera length (m)",
      flex: 1,
    },
    {
      field: "cameraLengthStep",
      headerName: "L step (m)",
      description: "Camera length step size (m)",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      width: 48,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AppConfigTableRow>) =>
        userNames.has(params.row.name) ? (
          <Tooltip title="Delete" placement="left">
            <IconButton
              size="small"
              onClick={() => beamlineConfigStore.deletePreset(params.row.name)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null,
    },
  ];

  const isScreenLarge = useMediaQuery(useTheme().breakpoints.up("lg"));

  return (
    <DataGrid
      autoHeight={!isScreenLarge}
      density="compact"
      rows={displayArray}
      getRowId={(row: AppConfigTableRow) => row.name}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      rowsPerPageOptions={[5, 10, 20, 100]}
      sx={{ border: 0 }}
      disableSelectionOnClick
    />
  );
}
