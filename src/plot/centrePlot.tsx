import { Box, Card, CardContent } from "@mui/material";
import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  VisCanvas,
  SvgCircle,
  SvgRect,
} from "@h5web/lib";
import { Vector3 } from "three";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { getDomains } from "./plotUtils";
import { PlotAxes, usePlotStore } from "./plotStore";
import { Beamstop, CircularDevice, Detector } from "../utils/types";

export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  const detector = useDetectorStore((state): Detector => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        resolution: {
          height: state.current.resolution.height * state.current.pixelSize,
          width: state.current.resolution.width * state.current.pixelSize,
        },
        pixelSize: state.current.pixelSize,
      };
    }
    return state.current;
  });
  const beamstop = useBeamstopStore((state): Beamstop => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        centre: {
          x: (state.centre.x ?? 0) * detector.pixelSize,
          y: (state.centre.y ?? 0) * detector.pixelSize,
        },
        diameter: state.diameter,
        clearance: (state.clearance ?? 0) * detector.pixelSize,
      };
    }
    return {
      centre: state.centre,
      diameter: state.diameter / detector.pixelSize,
      clearance: state.clearance,
    };
  });

  const cameraTube = useCameraTubeStore((state): CircularDevice => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        centre: {
          x: (state.centre.x ?? 0) * detector.pixelSize,
          y: (state.centre.y ?? 0) * detector.pixelSize,
        },
        diameter: state.diameter,
      };
    }
    return {
      centre: state.centre,
      diameter: state.diameter / detector.pixelSize,
    };
  });

  //const cameraTube = useCameraTubeStore();
  const domains = getDomains(detector, {
    centre: cameraTube.centre,
    diameter: cameraTube.diameter,
  });

  return (
    <Box>
      <Card>
        <CardContent>
          <div
            style={{
              display: "grid",
              height: "60vh",
              width: "50vw",
              border: "solid black",
            }}
          >
            <VisCanvas
              abscissaConfig={{
                visDomain: [domains.xAxis.min, domains.xAxis.max],
                showGrid: true,
                nice: true,
              }}
              ordinateConfig={{
                visDomain: [domains.yAxis.max, domains.yAxis.min],
                showGrid: true,
                nice: true,
              }}
            >
              <DefaultInteractions />
              <ResetZoomButton />
              <DataToHtml
                points={[
                  new Vector3(beamstop.centre.x ?? 0, beamstop.centre.y ?? 0),
                  new Vector3(
                    (beamstop.centre.x ?? 0) + beamstop.diameter / 2,
                    beamstop.centre.y ?? 0,
                  ),
                  new Vector3(
                    (beamstop.centre.x ?? 0) +
                    beamstop.diameter / 2 +
                    (beamstop.clearance ?? 0),
                    beamstop.centre.y ?? 0,
                  ),
                  new Vector3(
                    cameraTube.centre.x ?? 0,
                    cameraTube.centre.y ?? 0,
                  ),
                  new Vector3(
                    (cameraTube.centre.x ?? 0) + cameraTube.diameter / 2,
                    cameraTube.centre.y ?? 0,
                  ),
                  new Vector3(0, 0),
                  new Vector3(
                    detector.resolution.width,
                    detector.resolution.height,
                  ),
                ]}
              >
                {(
                  beamstopCentre: Vector3,
                  beamstopPerimeter: Vector3,
                  clearance: Vector3,
                  cameraTubeCentre: Vector3,
                  cameraTubePerimeter: Vector3,
                  detectorLower: Vector3,
                  detectorUpper: Vector3,
                ) => (
                  <SvgElement>
                    {plotConfig.cameraTube &&
                      <SvgCircle
                        coords={[cameraTubeCentre, cameraTubePerimeter]}
                        fill="rgba(0, 255, 0, 0.2)"
                        id="camera tube"
                      />}
                    {plotConfig.clearnace &&
                      <SvgCircle
                        coords={[beamstopCentre, clearance]}
                        fill="rgba(0, 0, 255, 0.2)"
                        id="clearance"
                      />}
                    {plotConfig.beamstop &&
                      <SvgCircle
                        coords={[beamstopCentre, beamstopPerimeter]}
                        fill="black"
                        id="beamstop"
                      />}
                    {plotConfig.detector &&
                      <SvgRect
                        coords={[detectorLower, detectorUpper]}
                        fill="rgba(255, 0, 0, 0.2)"
                        id="detector"
                        stroke="black"
                        strokePosition="outside"
                        strokeWidth={0}
                      />}
                  </SvgElement>
                )}
              </DataToHtml>
            </VisCanvas>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
