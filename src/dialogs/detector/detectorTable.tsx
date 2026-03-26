import { AppDetector } from "../../utils/types";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useDetectorStore } from "../../data-entry/detectorStore";
import { LengthUnits } from "../../utils/units";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface DetectorTableRow {
  name: string;
  resolution_height: number;
  resolution_width: number;
  pixel_height: number;
  pixel_width: number;
  modules: string;
}

function createData(name: string, detector: AppDetector): DetectorTableRow {
  const mask = detector.mask;
  let modules = "—";
  if (mask) {
    const missing = mask.missingModules?.length ?? 0;
    modules =
      `${mask.horizontalModules} × ${mask.verticalModules}` +
      (missing > 0 ? ` (${missing} missing)` : "");
  }
  return {
    name,
    resolution_height: detector.resolution.height,
    resolution_width: detector.resolution.width,
    pixel_height: detector.pixelSize.height.toNumber(LengthUnits.millimetre),
    pixel_width: detector.pixelSize.width.toNumber(LengthUnits.millimetre),
    modules,
  };
}

export default function DetectorTable() {
  const detectorStore = useDetectorStore();
  const displayArray: DetectorTableRow[] = [];
  for (const [key, value] of Object.entries(detectorStore.detectorRecord)) {
    displayArray.push(createData(key, value));
  }

  const userNames = new Set(Object.keys(detectorStore.userDetectorRecord));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "resolution_height",
      headerName: "Res. H (px)",
      description: "Resolution height (px)",
      flex: 1,
    },
    {
      field: "resolution_width",
      headerName: "Res. W (px)",
      description: "Resolution width (px)",
      flex: 1,
    },
    {
      field: "pixel_height",
      headerName: "Px H (mm)",
      description: "Pixel height (mm)",
      flex: 1,
    },
    {
      field: "pixel_width",
      headerName: "Px W (mm)",
      description: "Pixel width (mm)",
      flex: 1,
    },
    {
      field: "modules",
      headerName: "Modules",
      description: "Module grid (H × V) and number of missing modules",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "",
      width: 48,
      sortable: false,
      renderCell: (params: GridRenderCellParams<DetectorTableRow>) =>
        userNames.has(params.row.name) ? (
          <Tooltip title="Delete" placement="left">
            <IconButton
              size="small"
              onClick={() => detectorStore.deleteDetector(params.row.name)}
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
      getRowId={(row: DetectorTableRow) => row.name}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      rowsPerPageOptions={[5, 10, 20, 100]}
      sx={{ border: 0 }}
      disableSelectionOnClick
    />
  );
}
