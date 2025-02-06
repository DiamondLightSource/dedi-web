import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgElement,
  SvgLine,
  SvgRect,
  VisCanvas,
} from "@h5web/lib";
import { Card, CardContent, Stack } from "@mui/material";
import { Unit, createUnit } from "mathjs";
import { Vector3 } from "three";
import { computeQrange } from "../calculations/qrange";
import {
  BeamlineConfigStore,
  useBeamlineConfigStore,
} from "../data-entry/beamlineconfigStore";
import { BeamstopStore, useBeamstopStore } from "../data-entry/beamstopStore";
import {
  CameraTubeStore,
  useCameraTubeStore,
} from "../data-entry/cameraTubeStore";
import { DetectorStore, useDetectorStore } from "../data-entry/detectorStore";
import ResultsBar from "../results/resultsBar";
import LegendBar from "./legendBar";
import { usePlotStore } from "./plotStore";
import { color2String, getDomain } from "./plotUtils";
import SvgAxisAlignedEllipse from "./svgEllipse";
import { useMemo } from "react";
import { formatLogMessage } from "../utils/units";
import SvgMask from "./svgMask";
import { Plotter } from "./plotter";
import UnitRange from "../calculations/unitRange";
import { ResultStore, useResultStore } from "../results/resultsStore";

// Define Zustand selectors outside of render function for useMemo
const detectorSelector = (state: DetectorStore) => state.detector;
const beamlineConfigSelector = (state: BeamlineConfigStore) => ({
  beamline: state.beamline,
  wavelength: state.wavelength,
  angle: state.angle,
  cameraLength: state.cameraLength,
});
const beamstopSelector = (state: BeamstopStore) => state.beamstop;
const cameraTubeSelector = (state: CameraTubeStore) => state.cameraTube;
const RequestedRangeSelector = (state: ResultStore) => {
  if (!state.requestedMax || !state.requestedMin) {
    return null;
  }
  return new UnitRange(
    state.getUnit(state.requestedMin),
    state.getUnit(state.requestedMax),
  );
};

/**
 * A react componenet that plots a diagram of the system
 * @returns
 */
export default function CentrePlot(): JSX.Element {
  const plotConfig = usePlotStore();
  const beamlineConfig = useBeamlineConfigStore(beamlineConfigSelector);
  const detector = useDetectorStore(detectorSelector);
  const beamstop = useBeamstopStore(beamstopSelector);
  const cameraTube = useCameraTubeStore(cameraTubeSelector);
  const requestedRange = useResultStore(RequestedRangeSelector);

  // Calculate qrange if anything has changed
  const { minPoint, maxPoint, visibleQRange, fullQRange } = useMemo(() => {
    console.info(formatLogMessage("Calculating Q range"));

    // Rethink in future
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

    createUnit("xpixel", detector.pixelSize.width.toString());
    createUnit("ypixel", detector.pixelSize.height.toString());
    return computeQrange(detector, beamstop, cameraTube, beamlineConfig);
  }, [detector, beamstop, cameraTube, beamlineConfig]);

  const plotter = new Plotter(
    beamstop,
    cameraTube,
    detector,
    beamlineConfig,
    minPoint,
    maxPoint,
    requestedRange,
    plotConfig.plotAxes,
  );

  const plotBeamstop = plotter.createBeamstop();
  const plotCameraTube = plotter.createCameratube();
  const plotDetector = plotter.createDetector();
  const plotClearance = plotter.createClearnace();
  const plotVisibleRange = plotter.createVisibleRange();
  const plotRequestedRange = plotter.createRequestedRange();

  const domains = getDomain(plotDetector);
  console.info(formatLogMessage("Refreshing plot"));
  return (
    <Stack direction="column" spacing={1} flexGrow={1}>
      <Stack direction={{ sm: "column", md: "row" }} spacing={1} flexGrow={1}>
        <Card variant="outlined" sx={{ aspectRatio: 1.07 / 1 }}>
          <CardContent sx={{ width: "100%", height: "100%" }}>
            <div
              style={{
                display: "grid",
                width: "100%",
                height: "100%",
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
                          fill={color2String(plotConfig.detectorColor)}
                          id="detector"
                        />
                      )}
                      {plotConfig.mask && (
                        <SvgMask
                          coords={[detectorLower, detectorUpper]}
                          fill={color2String(plotConfig.maskColor)}
                          numModules={
                            new Vector3(
                              detector.mask.horizontalModules,
                              detector.mask.verticalModules,
                            )
                          }
                          gapFraction={
                            new Vector3(
                              detector.mask.horizontalGap /
                                detector.resolution.width,
                              detector.mask.verticalGap /
                                detector.resolution.height,
                            )
                          }
                          missingSegments={detector.mask.missingModules ?? []}
                        />
                      )}
                      {plotConfig.inaccessibleRange &&
                        plotConfig.visibleRange && (
                          <SvgLine
                            coords={[beamstopCentre, visibleRangeStart]}
                            stroke={color2String(
                              plotConfig.inaccessibleRangeColor,
                            )}
                            strokeWidth={3}
                            id="inaccessible"
                          />
                        )}
                      {/* {plotConfig.calibrant && (
                        <SvgCalibrant
                          beamCentre={cameraTubeCentre}
                          endPointX={calibrantLastRing}
                          endPointY={calibrantLastRing}
                          ringFractions={calibrantRings.fractions}
                          fill="transparent"
                          stroke={color2String(plotConfig.calibrantColor)}
                          strokeWidth="3"
                          id="calibrant"
                        />
                      )} */}
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
                          stroke={color2String(plotConfig.requestedRangeColor)}
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
        <LegendBar />
      </Stack>
      <ResultsBar visibleQRange={visibleQRange} fullQRange={fullQRange} />
    </Stack>
  );
}
