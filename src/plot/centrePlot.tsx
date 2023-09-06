import { Box, Card, CardContent } from "@mui/material";
import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  VisCanvas,
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
              abscissaConfig={{ visDomain: [0, 10], showGrid: true, nice: true }}
              ordinateConfig={{ visDomain: [0, 10], showGrid: true, nice: true }}
            >
              <DefaultInteractions />
              <ResetZoomButton />
              <DataToHtml
                points={[
                  new Vector3(beamstop.centre.x ?? 0, beamstop.centre.y ?? 0),
                  new Vector3(beamstop.diameter),
                  new Vector3(beamstop.clearance ?? 0),
                  new Vector3(cameraTube.centre.x ?? 0, cameraTube.centre.y ?? 0),
                  new Vector3(cameraTube.diameter),
                  new Vector3(detector.current.resolution.height, detector.current.resolution.width),
                ]}
              >
                {(beamstopCentre: Vector3, BeamstopDiameter: Vector3, clearnace: Vector3, cameraTubeCentre: Vector3, cameraTubeDiameter: Vector3, detectorResolution: Vector3) => (
                  <SvgElement>
                    <rect x={4} y={4} width={detectorResolution.y} height={detectorResolution.x} fill="rgba(255, 0, 0, 0.5)" stroke="lightseagreen" />
                    <circle cx={beamstopCentre.x} cy={beamstopCentre.y} r={BeamstopDiameter.x + clearnace.x} fill="rgba(255,0, 255, 0.5)" stroke="lightseagreen" />
                    <circle cx={beamstopCentre.x} cy={beamstopCentre.y} r={BeamstopDiameter.x} fill="black" stroke="lightseagreen" />
                    <circle cx={cameraTubeCentre.x} cy={cameraTubeCentre.y} r={cameraTubeDiameter.x} fill="rgba(255,255,0, 0.5)" stroke="lightseagreen" />
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
