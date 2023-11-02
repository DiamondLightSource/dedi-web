import { Box, Card, CardContent, Stack } from "@mui/material";
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
import { MathUtils, Vector2, Vector3 } from "three";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { getDomains } from "./plotUtils";
import { PlotAxes, usePlotStore } from "./plotStore";
import {
  BeamlineConfig,
  Beamstop,
  CircularDevice,
  Detector,
} from "../utils/types";
import { computeQrange } from "../calculations/qrange";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import LegendBar from "./legendBar";
import ResultsBar from "../results/resultsBar";
import NumericRange from "../calculations/numericRange";
import { getPointForQ } from "../calculations/qvalue";
import { ScatteringOptions, useResultStore } from "../results/resultsStore";
import {
  AngleUnits,
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  angstroms2Nanometres,
  nanometres2Angstroms,
} from "../utils/units";
import { convertBetweenQAndD, convertBetweenQAndS } from "../results/scatteringQuantities";

export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  const beamlineConfig = useBeamlineConfigStore<BeamlineConfig>((state) => {
    let angle = state.angle;
    let wavelength = state.wavelength;

    if (wavelength && state.wavelengthUnits === WavelengthUnits.angstroms) {
      wavelength = angstroms2Nanometres(wavelength);
    }

    if (angle && state.angleUnits === AngleUnits.degrees) {
      angle = MathUtils.degToRad(angle);
    }

    return {
      angle: angle,
      cameraLength: state.cameraLength,
      minWavelength: state.minWavelength,
      maxWavelength: state.maxWavelength,
      minCameraLength: state.minCameraLength,
      maxCameraLength: state.maxCameraLength,
      wavelength: wavelength,
    };
  });


  const detector = useDetectorStore((state) => state.current);
  const beamstop = useBeamstopStore((state): Beamstop => {
    return {
      centre: state.centre,
      diameter: state.diameter,
      clearance: state.clearance,
    };
  });
  const cameraTube = useCameraTubeStore((state): CircularDevice => {
    return { centre: state.centre, diameter: state.diameter };
  });

  const qrangeResult = computeQrange(
    detector,
    beamstop,
    cameraTube,
    beamlineConfig,
  );

  const { ptMin, ptMax, visibleQRange, fullQRange } = qrangeResult;
  const adjustUnitsDetector = (detector: Detector): Detector => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        resolution: {
          height: detector.resolution.height * detector.pixelSize.height,
          width: detector.resolution.width * detector.pixelSize.width,
        },
        pixelSize: detector.pixelSize,
      };
    }
    return detector;
  };

  const adjustUnitsBeamstop = (
    beamstop: Beamstop,
    detector: Detector,
  ): Beamstop => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        centre: {
          x: (beamstop.centre.x ?? 0) * detector.pixelSize.width,
          y: (beamstop.centre.y ?? 0) * detector.pixelSize.height,
        },
        diameter: beamstop.diameter,
        clearance: (beamstop.clearance ?? 0) * detector.pixelSize.height,
      };
    }
    return {
      centre: beamstop.centre,
      diameter: beamstop.diameter / detector.pixelSize.height,
      clearance: beamstop.clearance,
    };
  };

  const adjustUnitsCameraTube = (
    cameraTube: CircularDevice,
    detector: Detector,
  ): CircularDevice => {
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return {
        centre: {
          x: (cameraTube.centre.x ?? 0) * detector.pixelSize.height,
          y: (cameraTube.centre.y ?? 0) * detector.pixelSize.width,
        },
        diameter: cameraTube.diameter,
      };
    }
    return {
      centre: cameraTube.centre,
      diameter: cameraTube.diameter / detector.pixelSize.height,
    };
  };

  const adjustRange = (
    ptMin: Vector2,
    ptMax: Vector2,
    detector: Detector,
  ): { ptMin: Vector2; ptMax: Vector2 } => {
    const pixelVector = new Vector2(
      detector.pixelSize.width,
      detector.pixelSize.height,
    );
    if (plotConfig.plotAxes === PlotAxes.milimeter) {
      return { ptMin: ptMin, ptMax: ptMax };
    }
    return {
      ptMin: ptMin.divide(pixelVector),
      ptMax: ptMax.divide(pixelVector),
    };
  };

  const ajustedBeamstop = adjustUnitsBeamstop(beamstop, detector);
  const ajustedDetector = adjustUnitsDetector(detector);
  const ajustedCameraTube = adjustUnitsCameraTube(cameraTube, detector);

  const ajustedPoints = adjustRange(ptMin, ptMax, detector);

  const domains = getDomains(ajustedDetector, ajustedCameraTube);

  //
  const requestedRange = useResultStore<NumericRange | null>((state) => {
    if (!state.requestedMax || !state.requestedMin) {
      return null;
    }
    return NumericRange.createWithFunc(
      state.requestedMin,
      state.requestedMax,
      (value: number): number => {
        switch (state.requested) {
          case ScatteringOptions.d:
            if (state.dUnits === WavelengthUnits.angstroms) {
              value = angstroms2Nanometres(value);
            }
            value = convertBetweenQAndD(value)
            break;
          case ScatteringOptions.s:
            if (state.sUnits === WavelengthUnits.angstroms) {
              value = angstroms2Nanometres(value);
            }
            value = convertBetweenQAndS(value);
            break;
          default:
            if (state.qUnits === ReciprocalWavelengthUnits.angstroms) {
              value = nanometres2Angstroms(value);
            }
        }
        return value;
      })
  });

  let requestedDiagramMin: Vector2 | null = new Vector2(0, 0);
  let requestedDiagramMax: Vector2 | null = new Vector2(0, 0);

  if (requestedRange && beamlineConfig.angle && beamlineConfig.cameraLength && beamlineConfig.wavelength) {
    requestedDiagramMax = getPointForQ(
      requestedRange.max * 1e9,
      beamlineConfig.angle,
      beamlineConfig.cameraLength,
      (beamlineConfig.wavelength) * 1e-9,
      ajustedBeamstop,
    );
    requestedDiagramMin = getPointForQ(
      requestedRange.min * 1e9,
      beamlineConfig.angle,
      beamlineConfig.cameraLength,
      (beamlineConfig.wavelength) * 1e-9,
      ajustedBeamstop,
    );
  }
  return (
    <Box>
      <Stack direction="column" spacing={2}>
        <Stack direction="row" spacing={2}>
          <Card>
            <CardContent>
              <div
                style={{
                  display: "grid",
                  height: "60vh",
                  width: "60vh",
                  border: "solid black",
                }}
              >
                <VisCanvas
                  showGrid={true}
                  abscissaConfig={{
                    visDomain: [domains.xAxis.min, domains.xAxis.max], showGrid: true
                  }}
                  ordinateConfig={{
                    visDomain: [domains.yAxis.max, domains.yAxis.min], showGrid: true
                  }}
                >
                  <DefaultInteractions />
                  <ResetZoomButton />
                  <DataToHtml
                    points={[
                      new Vector3(
                        ajustedBeamstop.centre.x ?? 0,
                        ajustedBeamstop.centre.y ?? 0,
                      ),
                      new Vector3(
                        (ajustedBeamstop.centre.x ?? 0) +
                        ajustedBeamstop.diameter / 2,
                        ajustedBeamstop.centre.y ?? 0,
                      ),
                      new Vector3(
                        ajustedBeamstop.centre.x ?? 0,
                        (ajustedBeamstop.centre.y ?? 0) +
                        ajustedBeamstop.diameter / 2 +
                        (ajustedBeamstop.clearance ?? 0),
                      ),
                      new Vector3(
                        ajustedCameraTube.centre.x ?? 0,
                        ajustedCameraTube.centre.y ?? 0,
                      ),
                      new Vector3(
                        ajustedCameraTube.centre.x ?? 0,
                        (ajustedCameraTube.centre.y ?? 0) +
                        ajustedCameraTube.diameter / 2,
                      ),
                      new Vector3(0, 0),
                      new Vector3(
                        ajustedDetector.resolution.width,
                        ajustedDetector.resolution.height,
                      ),
                      new Vector3(ajustedPoints.ptMin.x, ajustedPoints.ptMin.y),
                      new Vector3(ajustedPoints.ptMax.x, ajustedPoints.ptMax.y),
                      new Vector3(requestedDiagramMin.x, requestedDiagramMin.y),
                      new Vector3(requestedDiagramMax.x, requestedDiagramMax.y),
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
                      minQRange: Vector3,
                      maxQRange: Vector3,
                      requestedMin: Vector3,
                      requestedMax: Vector3,
                    ) => (
                      <SvgElement>
                        {plotConfig.cameraTube && (
                          <SvgCircle
                            coords={[cameraTubeCentre, cameraTubePerimeter]}
                            fill="rgba(0, 0, 255, 0.2)"
                            id="camera tube"
                          />
                        )}
                        {plotConfig.qrange && plotConfig.beamstop && (
                          <SvgLine
                            coords={[minQRange, maxQRange]}
                            stroke="red"
                            strokeWidth={2}
                          />
                        )}
                        {requestedMin && requestedMax && plotConfig.qrange && (
                          <SvgLine
                            coords={[requestedMin, requestedMax]}
                            stroke="green"
                            strokeWidth={2}
                          />
                        )}
                        {plotConfig.qrange && plotConfig.beamstop && requestedMin && requestedMax && (
                          <SvgLine
                            coords={[beamstopCentre, minQRange]}
                            stroke="orange"
                            strokeWidth={2}
                          />
                        )}
                        {plotConfig.beamstop && plotConfig.qrange && requestedMin && requestedMax && (
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
          <Box flexGrow={1}>
            <LegendBar />
          </Box>
        </Stack>
        <ResultsBar visableQRange={visibleQRange} fullQrange={fullQRange} />
      </Stack>
    </Box>
  );
}
