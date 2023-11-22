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
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "../results/scatteringQuantities";
import { color2String } from "./plotUtils";

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
      cameraLengthStep: state.cameraLengthStep,
      wavelength: wavelength,
    };
  });

  let detector = useDetectorStore<Detector>((state) => state.current);
  const beamstop = useBeamstopStore<Beamstop>((state) => {
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
            value = convertBetweenQAndD(value);
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
      },
    );
  });

  const pixelVector = new Vector2(
    detector.pixelSize.width,
    detector.pixelSize.height,
  );

  switch (plotConfig.plotAxes) {
    case PlotAxes.milimeter:
      beamstop.centre = {
        x: (beamstop.centre.x ?? 0) * detector.pixelSize.width,
        y: (beamstop.centre.y ?? 0) * detector.pixelSize.height,
      };
      beamstop.clearance = (beamstop.clearance ?? 0) * detector.pixelSize.height
      cameraTube.centre = {
        x: (cameraTube.centre.x ?? 0) * detector.pixelSize.height,
        y: (cameraTube.centre.y ?? 0) * detector.pixelSize.width,
      }
      detector = {
        ...detector, resolution: {
          height: detector.resolution.height * detector.pixelSize.height,
          width: detector.resolution.width * detector.pixelSize.width,
        }
      }
      break;
    default:
      beamstop.diameter = beamstop.diameter / detector.pixelSize.height
      cameraTube.diameter = cameraTube.diameter / detector.pixelSize.height
      ptMin.divide(pixelVector);
      ptMax.divide(pixelVector);
      if (requestedRange) {
        requestedRange.inPlaceApply((item => item / detector.pixelSize.height))
      }
  }

  const domains = getDomains(
    detector,
    cameraTube,
    plotConfig.plotAxes,
  );

  // rethink this

  let requestedDiagramMin: Vector2 | null = new Vector2(0, 0);
  let requestedDiagramMax: Vector2 | null = new Vector2(0, 0);

  if (
    requestedRange &&
    beamlineConfig.angle &&
    beamlineConfig.cameraLength &&
    beamlineConfig.wavelength
  ) {
    requestedDiagramMax = getPointForQ(
      requestedRange.max * 1e9,
      beamlineConfig.angle,
      beamlineConfig.cameraLength,
      beamlineConfig.wavelength * 1e-9,
      beamstop,
    );
    requestedDiagramMin = getPointForQ(
      requestedRange.min * 1e9,
      beamlineConfig.angle,
      beamlineConfig.cameraLength,
      beamlineConfig.wavelength * 1e-9,
      beamstop,
    );
  }
  return (
    <Box>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
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
                    visDomain: [domains.xAxis.min, domains.xAxis.max],
                    showGrid: true,
                  }}
                  ordinateConfig={{
                    visDomain: [domains.yAxis.max, domains.yAxis.min],
                    showGrid: true,
                  }}
                >
                  <DefaultInteractions />
                  <ResetZoomButton />
                  <DataToHtml
                    points={[
                      new Vector3(
                        beamstop.centre.x ?? 0,
                        beamstop.centre.y ?? 0,
                      ),
                      new Vector3(
                        (beamstop.centre.x ?? 0) +
                        beamstop.diameter / 2,
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
                        (cameraTube.centre.y ?? 0) +
                        cameraTube.diameter / 2,
                      ),
                      new Vector3(0, 0),
                      new Vector3(
                        detector.resolution.width,
                        detector.resolution.height,
                      ),
                      new Vector3(ptMin.x, ptMin.y),
                      new Vector3(ptMax.x, ptMax.y),
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
                            fill={color2String(plotConfig.cameraTubeColor)}
                            id="camera tube"
                          />
                        )}
                        {plotConfig.detector && (
                          <SvgRect
                            coords={[detectorLower, detectorUpper]}
                            fill={color2String(plotConfig.detectorColour)}
                            id="detector"
                          />
                        )}
                        {plotConfig.inaccessibleRange && (
                          <SvgLine
                            coords={[beamstopCentre, minQRange]}
                            stroke={color2String(plotConfig.inaccessibleRangeColor)}
                            strokeWidth={3}
                            id="inaccessible"
                          />
                        )}
                        {plotConfig.clearnace && (
                          <SvgCircle
                            coords={[beamstopCentre, clearance]}
                            fill={color2String(plotConfig.clearanceColor)}
                            id="clearance"
                          />
                        )}
                        {plotConfig.visibleRange && (
                          <SvgLine
                            coords={[minQRange, maxQRange]}
                            stroke={color2String(plotConfig.visibleColor)}
                            strokeWidth={3}
                            id="visible"
                          />
                        )}
                        {requestedMin && requestedMax && plotConfig.requestedRange && (
                          <SvgLine
                            coords={[requestedMin, requestedMax]}
                            stroke={color2String(plotConfig.requestedRangeColor)}
                            strokeWidth={3}
                            id="requested"
                          />
                        )}
                        {plotConfig.beamstop && (
                          <SvgCircle
                            coords={[beamstopCentre, beamstopPerimeter]}
                            fill={color2String(plotConfig.beamstopColor)}
                            id="beamstop"
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
