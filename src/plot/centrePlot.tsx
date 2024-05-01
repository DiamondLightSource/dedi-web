import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  SvgLine,
  SvgRect,
  VisCanvas,
} from "@h5web/lib";
import { Box, Card, CardContent, Stack } from "@mui/material";
import { Unit, MathType, divide, multiply, unit, createUnit} from "mathjs";
import { Vector2, Vector3 } from "three";
import { computeQrange } from "../calculations/qrange";
import { getPointForQ } from "../calculations/qvalue";
import UnitRange from "../calculations/unitRange";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import ResultsBar from "../results/resultsBar";
import {
  ResultStore,
  ScatteringOptions,
  useResultStore,
} from "../results/resultsStore";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "../results/scatteringQuantities";
import {
  AppBeamstop,
  AppCircularDevice,
  AppDetector,
  BeamlineConfig
} from "../utils/types";
import { Plotter } from "./Plotter";
import LegendBar from "./legendBar";
import { usePlotStore } from "./plotStore";
import { UnitVector, color2String, getDomains } from "./plotUtils";
import SvgAxisAlignedEllipse from "./svgEllipse";
import { useMemo } from "react";


/**
 * A react componenet that plots the items that make up the system
 * @returns
 */
export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  const beamlineConfig = useBeamlineConfig();
  const detectorStore = useDetectorStore();
  const beamstopStore = useBeamstopStore();
  const cameraTubeStore = useCameraTubeStore();


  // Needed for plotting in q space
  const scaleFactor: Unit | null = getScaleFactor(
    beamlineConfig.wavelength,beamlineConfig.cameraLength);

  const { ptMin, ptMax, visibleQRange, fullQRange } = useMemo(() => {
    // todo this might need to be moved elsewhere
    /* eslint-disable */
    // @ts-ignore
    if (Unit.UNITS.xpixel) {
      // @ts-ignore
      delete Unit.UNITS.xpixel;
    }
    // @ts-ignore
    if (Unit.UNITS.ypixel) {
      // @ts-ignore
      delete Unit.UNITS.ypixel;
    }
    /* eslint-enable */

    createUnit("xpixel", detectorStore.detector.pixelSize.width.toString());
    createUnit("ypixel", detectorStore.detector.pixelSize.height.toString());

    return computeQrange(
      detectorStore.detector,
      beamstopStore.beamstop, 
      cameraTubeStore.cameraTube,
      beamlineConfig);
  }, [
    detectorStore.detector,
    beamstopStore.beamstop, 
    cameraTubeStore.cameraTube,
    beamlineConfig,
  ]);

  // todo move these 2 statements into the ResultsBar component
  //  as that's the only place that uses these
  const visibleQRangeUnits = UnitRange.fromNumericRange(
    visibleQRange,
    "m^-1",
  ).to("nm^-1");
  console.log(visibleQRange);
  const fullQRangeUnits = UnitRange.fromNumericRange(fullQRange, "m^-1").to(
    "nm^-1",
  );

  const { beamstopCentre, cameraTubeCentre, minPoint, maxPoint } =
    getReferencePoints(
      ptMin, ptMax, beamstopStore.beamstop, cameraTubeStore.cameraTube);

  const plotter = new Plotter(plotConfig.plotAxes, scaleFactor);

  const {
    plotDetector,
    plotBeamstop,
    plotClearance,
    plotCameraTube,
    plotVisibleRange,
  } = createPlots(
    plotter,
    beamstopCentre,
    beamstopStore.beamstop,
    cameraTubeCentre,
    cameraTubeStore.cameraTube,
    detectorStore.detector,
    minPoint,
    maxPoint,
  );

  // abstracting state logic away from the display logic
  const requestedRange = useResultStore<UnitRange | null>(getRange());

  let plotRequestedRange = {
    start: new Vector3(0, 0),
    end: new Vector3(0, 0),
  };

  if (
    requestedRange &&
    beamlineConfig.cameraLength &&
    beamlineConfig.wavelength
  ) {
    plotRequestedRange = getRequestedRange(
      requestedRange,
      beamlineConfig,
      beamstopCentre,
      plotRequestedRange,
      plotter,
    );
  }

  const domains = getDomains(plotDetector);

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
                  width: "65vh",
                  border: "solid black",
                }}
              >
                <VisCanvas
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
                      plotBeamstop.centre,
                      plotBeamstop.endPointX,
                      plotBeamstop.endPointY,
                      plotClearance.centre,
                      plotClearance.endPointX,
                      plotClearance.endPointY,
                      plotCameraTube.centre,
                      plotCameraTube.endPointX,
                      plotCameraTube.endPointY,
                      plotDetector.lowerBound,
                      plotDetector.upperBound,
                      plotVisibleRange.start,
                      plotVisibleRange.end,
                      plotRequestedRange.start,
                      plotRequestedRange.end,
                    ]}
                  >
                    {(
                      beamstopCentre,
                      beamstopEndPointX,
                      beamstopEndPointY,
                      clearanceCentre,
                      clearnaceEndPointX,
                      clearenaceEndPointY,
                      cameraTubeCentre,
                      cameraTubeEndPointX,
                      cameraTubeEndPointY,
                      detectorLower,
                      detectorUpper,
                      visibleRangeStart,
                      visableRangeEnd,
                      requestedRangeStart,
                      requestedRangeEnd,
                    ) => (
                      <SvgElement>
                        {plotConfig.cameraTube && (
                          <SvgAxisAlignedEllipse
                            coords={[
                              cameraTubeCentre,
                              cameraTubeEndPointX,
                              cameraTubeEndPointY,
                            ]}
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
                            coords={[beamstopCentre, visibleRangeStart]}
                            stroke={color2String(
                              plotConfig.inaccessibleRangeColor,
                            )}
                            strokeWidth={3}
                            id="inaccessible"
                          />
                        )}
                        {plotConfig.clearance && (
                          <SvgAxisAlignedEllipse
                            coords={[
                              clearanceCentre,
                              clearnaceEndPointX,
                              clearenaceEndPointY,
                            ]}
                            fill={color2String(plotConfig.clearanceColor)}
                            id="clearance"
                          />
                        )}
                        {plotConfig.visibleRange && (
                          <SvgLine
                            coords={[visibleRangeStart, visableRangeEnd]}
                            stroke={color2String(plotConfig.visibleColor)}
                            strokeWidth={3}
                            id="visible"
                          />
                        )}
                        {plotConfig.requestedRange && (
                          <SvgLine
                            coords={[requestedRangeStart, requestedRangeEnd]}
                            stroke={color2String(
                              plotConfig.requestedRangeColor,
                            )}
                            strokeWidth={3}
                            id="requested"
                          />
                        )}
                        {plotConfig.beamstop && (
                          <SvgAxisAlignedEllipse
                            coords={[
                              beamstopCentre,
                              beamstopEndPointX,
                              beamstopEndPointY,
                            ]}
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
        <ResultsBar
          visableQRange={visibleQRangeUnits}
          fullQrange={fullQRangeUnits}
        />
      </Stack>
    </Box>
  );
}

/**
 * Calculates the scale factor which is used for Plotting in units of Q
 * @param wavelength current wave length as a Unit
 * @param cameraLength cameralength
 * @returns 
 */
function getScaleFactor(wavelength: Unit, cameraLength: number | null) {
  let scaleFactor: MathType | null = null;
  if (cameraLength && wavelength) {
    scaleFactor = divide(
      2 * Math.PI,
      multiply(
        unit(cameraLength, "m"),
        wavelength.to("m"),
      ),
    );
  }
  if (scaleFactor == null) {
    return scaleFactor;
  }
  if (typeof scaleFactor == "number" || !("units" in scaleFactor)) {
    throw TypeError("scaleFactor should be a unit not a number");
  }
  return scaleFactor;
}

function useBeamlineConfig(): BeamlineConfig{
  return useBeamlineConfigStore<BeamlineConfig>((state) => {
    return {
      angle: state.angle,
      cameraLength: state.cameraLength,
      beamline:{
        minWavelength: state.beamline.minWavelength,
        maxWavelength: state.beamline.maxWavelength,
        minCameraLength: state.beamline.minCameraLength,
        maxCameraLength: state.beamline.maxCameraLength,
        cameraLengthStep: state.beamline.cameraLengthStep,
      },
      wavelength: state.wavelength,
    };
  });
}

function getReferencePoints(
  ptMin: Vector2,
  ptMax: Vector2,
  beamstop: AppBeamstop,
  cameraTube: AppCircularDevice,
) {
  const minPoint: UnitVector = {
    x: unit(ptMin.x, "m"),
    y: unit(ptMin.y, "m"),
  };

  const maxPoint: UnitVector = {
    x: unit(ptMax.x, "m"),
    y: unit(ptMax.y, "m"),
  };

  const beamstopCentre: UnitVector = {
    x: unit(beamstop.centre.x ?? NaN, "xpixel"),
    y: unit(beamstop.centre.y ?? NaN, "ypixel"),
  };

  const cameraTubeCentre: UnitVector = {
    x: unit(cameraTube.centre.x ?? NaN, "xpixel"),
    y: unit(cameraTube.centre.y ?? NaN, "ypixel"),
  };
  return { beamstopCentre, cameraTubeCentre, minPoint, maxPoint };
}

function createPlots(
  plotter: Plotter,
  beamstopCentre: UnitVector,
  beamstop: AppBeamstop,
  cameraTubeCentre: UnitVector,
  cameraTube: AppCircularDevice,
  detector: AppDetector,
  minPoint: UnitVector,
  maxPoint: UnitVector,
) {
  const plotBeamstop = plotter.createPlotEllipse(
    beamstopCentre,
    beamstop.diameter,
    beamstopCentre,
  );

  const plotCameraTube = plotter.createPlotEllipse(
    cameraTubeCentre,
    cameraTube.diameter,
    beamstopCentre,
  );

  const plotClearance = plotter.createPlotEllipseClearance(
    beamstopCentre,
    beamstop.diameter,
    beamstop.clearance ?? 0,
    beamstopCentre,
  );

  const plotDetector = plotter.createPlotRectangle(
    detector.resolution,
    beamstopCentre,
  );

  const plotVisibleRange = plotter.createPlotRange(
    minPoint,
    maxPoint,
    beamstopCentre,
  );
  return {
    plotDetector,
    plotBeamstop,
    plotClearance,
    plotCameraTube,
    plotVisibleRange,
  };
}

function getRequestedRange(
  requestedRange: UnitRange,
  beamlineConfig: BeamlineConfig,
  beamstopCentre: UnitVector,
  plotRequestedRange: { start: Vector3; end: Vector3 },
  plotter: Plotter,
) {
  const requestedMaxPt = getPointForQ(
    requestedRange.max,
    beamlineConfig.angle,
    unit(beamlineConfig.cameraLength ?? NaN, "m"),
    beamlineConfig.wavelength,
    beamstopCentre,
  );
  const requestedMinPt = getPointForQ(
    requestedRange.min,
    beamlineConfig.angle,
    unit(beamlineConfig.cameraLength ?? NaN, "m"),
    beamlineConfig.wavelength,
    beamstopCentre,
  );
  plotRequestedRange = plotter.createPlotRange(
    requestedMinPt,
    requestedMaxPt,
    beamstopCentre,
  );
  return plotRequestedRange;
}

function getRange(): (state: ResultStore) => UnitRange | null {
  return (state) => {
    if (!state.requestedMax || !state.requestedMin) {
      return null;
    }

    const getUnit = (value: number): Unit => {
      let result: Unit;
      switch (state.requested) {
        case ScatteringOptions.d:
          result = convertBetweenQAndD(unit(value, state.dUnits));
          break;
        case ScatteringOptions.s:
          result = convertBetweenQAndS(unit(value, state.sUnits));
          break;
        default:
          result = unit(value, state.qUnits);
      }
      return result;
    };

    return new UnitRange(
      getUnit(state.requestedMin),
      getUnit(state.requestedMax),
    );
  };
}
