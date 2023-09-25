import { Box, Card, CardContent } from "@mui/material";
import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  VisCanvas,
  SvgCircle,
  SvgRect,
  SvgLine,
} from "@h5web/lib";
import { Vector2, Vector3 } from "three";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { getDomains } from "./plotUtils";
import { PlotAxes, usePlotStore } from "./plotStore";
import { Beamstop, CircularDevice, Detector } from "../utils/types";
import { computeQrange } from "../calculations/qrange";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";

export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  const bealineConfig = useBeamlineConfigStore();
  const detector = useDetectorStore((state): Detector => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        resolution: {
          height:
            state.current.resolution.height * state.current.pixelSize.height,
          width: state.current.resolution.width * state.current.pixelSize.width,
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
          x: (state.centre.x ?? 0) * detector.pixelSize.width,
          y: (state.centre.y ?? 0) * detector.pixelSize.height,
        },
        diameter: state.diameter,
        clearance: (state.clearance ?? 0) * detector.pixelSize.height,
      };
    }
    return {
      centre: state.centre,
      diameter: state.diameter / detector.pixelSize.height,
      clearance: state.clearance,
    };
  });

  const cameraTube = useCameraTubeStore((state): CircularDevice => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        centre: {
          x: (state.centre.x ?? 0) * detector.pixelSize.height,
          y: (state.centre.y ?? 0) * detector.pixelSize.width,
        },
        diameter: state.diameter,
      };
    }
    return {
      centre: state.centre,
      diameter: state.diameter / detector.pixelSize.height,
    };
  });

  // issue here needs working on
  const domains = getDomains(detector, cameraTube);

  const { ptMax, ptMin } = computeQrange(
    detector,
    beamstop,
    cameraTube,
    bealineConfig,
  ) ?? { ptMax: new Vector2(0, 0), ptMin: new Vector2(0, 0) };
  return (
    <Box>
      <Card>
        <CardContent>
          <div
            style={{
              display: "grid",
              height: "50vh",
              width: "50vh",
              border: "solid black",
            }}
          >
            <VisCanvas
              abscissaConfig={{
                visDomain: [domains.xAxis.min, domains.xAxis.max],
              }}
              ordinateConfig={{
                visDomain: [domains.yAxis.max, domains.yAxis.min],
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
                    beamstop.centre.x ?? 0,
                    (beamstop.centre.y ?? 0) +
                      beamstop.diameter / 2 +
                      (beamstop.clearance ?? 0),
                  ),
                  new Vector3(
                    cameraTube.centre.x ?? 0,
                    cameraTube.centre.y ?? 0,
                  ),
                  new Vector3(
                    cameraTube.centre.x ?? 0,
                    (cameraTube.centre.y ?? 0) + cameraTube.diameter / 2,
                  ),
                  new Vector3(0, 0),
                  new Vector3(
                    detector.resolution.width,
                    detector.resolution.height,
                  ),
                  new Vector3(ptMin.x, ptMin.y),
                  new Vector3(ptMax.x, ptMax.y),
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
                  visableRange: Vector3,
                  nonVisableRange: Vector3,
                ) => (
                  <SvgElement>
                    {plotConfig.cameraTube && (
                      <SvgCircle
                        coords={[cameraTubeCentre, cameraTubePerimeter]}
                        fill="rgba(0, 255, 0, 0.2)"
                        id="camera tube"
                      />
                    )}
                    {plotConfig.qrange && plotConfig.beamstop && (
                      <SvgLine
                        coords={[beamstopCentre, nonVisableRange]}
                        stroke="red"
                        strokeWidth={2}
                      />
                    )}
                    {plotConfig.qrange && plotConfig.beamstop && (
                      <SvgLine
                        coords={[nonVisableRange, visableRange]}
                        stroke="blue"
                        strokeWidth={2}
                      />
                    )}
                    {plotConfig.beamstop && (
                      <SvgCircle
                        coords={[beamstopCentre, clearance]}
                        fill="rgba(0, 0, 255, 0.2)"
                        id="clearance"
                      />
                    )}
                    {plotConfig.beamstop && (
                      <SvgCircle
                        coords={[beamstopCentre, beamstopPerimeter]}
                        fill="black"
                        id="beamstop"
                      />
                    )}
                    {plotConfig.detector && (
                      <SvgRect
                        coords={[detectorLower, detectorUpper]}
                        fill="rgba(255, 0, 0, 0.2)"
                        id="detector"
                        stroke="black"
                        strokePosition="outside"
                        strokeWidth={0}
                      />
                    )}
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
