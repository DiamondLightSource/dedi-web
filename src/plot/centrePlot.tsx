import { Box, Card, CardContent } from "@mui/material";
import BeamlinePlot from "./dynamicPlot";

export default function CentrePlot(): JSX.Element {
  return (
    <Box>
      <Card>
        <CardContent>
          <div style={{ display: "grid", height: "60vh", width: "50vw", border: "2px solid black" }}>
            <BeamlinePlot />
          </div>
        </CardContent>
      </Card>
    </Box >
  );
}