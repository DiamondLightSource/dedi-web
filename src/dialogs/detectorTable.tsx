import { AppDetector } from "../utils/types";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useDetectorStore } from "../data-entry/detectorStore";
import { LengthUnits } from "../utils/units";

interface DetectorTableRow {
  name: string;
  resolution_height: number;
  resolution_width: number;
  pixel_height: number;
  pixel_width: number;
}

function createData(name: string, detector: AppDetector): DetectorTableRow {
  return {
    name: name,
    resolution_height: detector.resolution.height,
    resolution_width: detector.resolution.width,
    pixel_height: detector.pixelSize.height.toNumber(LengthUnits.millimetre),
    pixel_width: detector.pixelSize.width.toNumber(LengthUnits.millimetre),
  };
}

export default function DetectorTable() {
  const detectorStore = useDetectorStore();
  const displayArray: DetectorTableRow[] = [];
  for (const [key, value] of Object.entries(detectorStore.detectorRecord)) {
    displayArray.push(createData(key, value));
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "name", flex: 1 },
    {
      field: "resolution_height",
      headerName: "resolution height (px)",
      flex: 1,
    },
    { field: "resolution_width", headerName: "resolution width (px)", flex: 1 },
    { field: "pixel_height", headerName: "pixel height (mm)", flex: 1 },
    { field: "pixel_width", headerName: "pixel width (mm)", flex: 1 },
  ];

  return (
    <DataGrid
      autoHeight
      rows={displayArray}
      getRowId={(row: DetectorTableRow) => row.name}
      columns={columns}
      components={{ Toolbar: GridToolbar }}
      sx={{ border: 0 }}
      disableSelectionOnClick
    />
  );
}
