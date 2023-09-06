import { Box, Card, CardContent } from "@mui/material";
import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  VisCanvas,
  SvgCircle,
  SvgRect,
} from "@h5web/lib"
import { Vector3 } from "three";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";


export default function CentrePlot(): JSX.Element {
  const beamstop = useBeamstopStore();
  const detector = useDetectorStore();
  const cameraTube = useCameraTubeStore();

  return (
    <Box>
      <Card>
        <CardContent>
          <div style={{ display: "grid", height: "60vh", width: "50vw", border: "solid black" }}>
            <VisCanvas
              style={{ padding: "5px 5px 5px" }}
              abscissaConfig={{ visDomain: [-10, 10], showGrid: true, nice: true }}
              ordinateConfig={{ visDomain: [-10, 10], showGrid: true, nice: true }}
            >
              <DefaultInteractions />
              <ResetZoomButton />
              <DataToHtml
                points={[
                  new Vector3(beamstop.centre.x ?? 0, beamstop.centre.y ?? 0),
                  new Vector3((beamstop.centre.x ?? 0) + beamstop.diameter / 2, beamstop.centre.y ?? 0),
                  new Vector3((beamstop.centre.x ?? 0) + beamstop.diameter / 2 + (beamstop.clearance ?? 0), beamstop.centre.y ?? 0),
                  new Vector3(cameraTube.centre.x ?? 0, cameraTube.centre.y ?? 0),
                  new Vector3((cameraTube.centre.x ?? 0) + cameraTube.diameter, cameraTube.centre.y ?? 0),
                  new Vector3(0, 0),
                  new Vector3(4, 4)
                ]}
              >
                {(beamstopCentre: Vector3, beamstopPerimeter: Vector3, clearance: Vector3, cameraTubeCentre: Vector3, cameraTubePerimeter: Vector3, detectorLower: Vector3, detectorUpper: Vector3) => (
                  <SvgElement>
                    <SvgCircle coords={[cameraTubeCentre, cameraTubePerimeter]} fill="rgba(255, 0, 0, 0.5)" id="camera tube" />
                    <SvgCircle coords={[beamstopCentre, clearance]} fill="rgba(255, 255, 0, 0.5)" id="clearance" />
                    <SvgCircle coords={[beamstopCentre, beamstopPerimeter]} fill="black" id="beamstop" />
                    <SvgRect coords={[detectorLower, detectorUpper]} fill="rgba(255, 0, 0, 0.5)" id="detector" stroke="black" strokePosition="outside" strokeWidth={0} />
                  </SvgElement>
                )}
              </DataToHtml>
            </VisCanvas>
          </div>
        </CardContent>
      </Card>
    </Box >
  );
}
