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
import * as mathjs from "mathjs";
import { Vector3 } from "three";
import { computeQrange } from "../calculations/qrange";
import { getPointForQ } from "../calculations/qvalue";
import UnitRange from "../calculations/unitRange";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import ResultsBar from "../results/resultsBar";
import { ScatteringOptions, useResultStore } from "../results/resultsStore";
import {
  convertBetweenQAndD,
  convertBetweenQAndS,
} from "../results/scatteringQuantities";
import {
  BeamlineConfig,
  Beamstop,
  CircularDevice,
  Detector,
} from "../utils/types";
import { Plotter } from "./Plotter";
import LegendBar from "./legendBar";
import { usePlotStore } from "./plotStore";
import { UnitVector, color2String, getDomains } from "./plotUtils";
import SvgAxisAlignedEllipse from "./svgEllipse";

// todo that's too long!
export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  // todo some form of destructuring notation {...state} might simplify this
  const beamlineConfig = useBeamlineConfigStore<BeamlineConfig>((state) => {
    return {
      angle: state.angle,
      cameraLength: state.cameraLength,
      minWavelength: state.minWavelength,
      maxWavelength: state.maxWavelength,
      minCameraLength: state.minCameraLength,
      maxCameraLength: state.maxCameraLength,
      cameraLengthStep: state.cameraLengthStep,
      wavelength: state.wavelength,
    };
  });

  const detector = useDetectorStore<Detector>((state) => {
    return {
      resolution: state.resolution,
      pixelSize: state.pixelSize,
    };
  });

  const beamstop = useBeamstopStore<Beamstop>((state) => {
    return {
      centre: state.centre,
      diameter: state.diameter,
      clearance: state.clearance,
    };
  });

  const cameraTube = useCameraTubeStore<CircularDevice>((state) => {
    return { centre: state.centre, diameter: state.diameter };
  });

  let scaleFactor: mathjs.Unit | null = null;
  if (beamlineConfig.cameraLength && beamlineConfig.wavelength) {
    scaleFactor = mathjs.divide(
      2 * Math.PI,
      mathjs.multiply(
        mathjs.unit(beamlineConfig.cameraLength, "m"),
        beamlineConfig.wavelength.to("m"),
      ),
    );
  }

  // evil :( :( :( :()
  /* eslint-disable */
  if (mathjs.Unit.UNITS.xpixel) {
    delete mathjs.Unit.UNITS.xpixel;
  }

  if (mathjs.Unit.UNITS.ypixel) {
    delete mathjs.Unit.UNITS.ypixel;
  }
  /* eslint-enable */
  // evil :( :( :( :()

  mathjs.createUnit("xpixel", detector.pixelSize.width.toString());
  mathjs.createUnit("ypixel", detector.pixelSize.height.toString());

  const { ptMin, ptMax, visibleQRange, fullQRange } = computeQrange(
    detector,
    beamstop,
    cameraTube,
    beamlineConfig,
  );

  // I am about here
  const visibleQRangeUnits = UnitRange.fromNumericRange(
    visibleQRange,
    "m^-1",
  ).to("nm^-1");
  const fullQRangeUnits = UnitRange.fromNumericRange(fullQRange, "m^-1").to(
    "nm^-1",
  );

  const minPoint: UnitVector = {
    x: mathjs.unit(ptMin.x, "m"),
    y: mathjs.unit(ptMin.y, "m"),
  };

  const maxPoint: UnitVector = {
    x: mathjs.unit(ptMax.x, "m"),
    y: mathjs.unit(ptMax.y, "m"),
  };

  const beamstopCentre: UnitVector = {
    x: mathjs.unit(beamstop.centre.x ?? NaN, "xpixel"),
    y: mathjs.unit(beamstop.centre.y ?? NaN, "ypixel"),
  };

  const cameraTubeCentre: UnitVector = {
    x: mathjs.unit(cameraTube.centre.x ?? NaN, "xpixel"),
    y: mathjs.unit(cameraTube.centre.y ?? NaN, "ypixel"),
  };

  const plotter = new Plotter(plotConfig.plotAxes, scaleFactor);

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

  // I am up to here

  const requestedRange = useResultStore<UnitRange | null>((state) => {
    if (!state.requestedMax || !state.requestedMin) {
      return null;
    }

    const getUnit = (value: number): mathjs.Unit => {
      let result: mathjs.Unit;
      switch (state.requested) {
        case ScatteringOptions.d:
          result = convertBetweenQAndD(mathjs.unit(value, state.dUnits));
          break;
        case ScatteringOptions.s:
          result = convertBetweenQAndS(mathjs.unit(value, state.sUnits));
          break;
        default:
          result = mathjs.unit(value, state.qUnits);
      }
      return result;
    };

    return new UnitRange(
      getUnit(state.requestedMin),
      getUnit(state.requestedMax),
    );
  });

  let plotRequestedRange = {
    start: new Vector3(0, 0),
    end: new Vector3(0, 0),
  };
  if (
    requestedRange &&
    beamlineConfig.cameraLength &&
    beamlineConfig.wavelength
  ) {
    const requestedMaxPt = getPointForQ(
      requestedRange.max,
      beamlineConfig.angle,
      mathjs.unit(beamlineConfig.cameraLength, "m"),
      beamlineConfig.wavelength,
      beamstopCentre,
    );
    const requestedMinPt = getPointForQ(
      requestedRange.min,
      beamlineConfig.angle,
      mathjs.unit(beamlineConfig.cameraLength, "m"),
      beamlineConfig.wavelength,
      beamstopCentre,
    );
    plotRequestedRange = plotter.createPlotRange(
      requestedMinPt,
      requestedMaxPt,
      beamstopCentre,
    );
  }

  console.log(plotDetector);

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
