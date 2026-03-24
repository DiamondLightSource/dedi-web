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
import Box from "@mui/material/Box";
import { Unit, createUnit, unit } from "mathjs";
import { Vector3 } from "three";
import { computeQrange } from "../calculations/qrange";
import { useBeamlineConfigStore } from "../data-entry/beamlineconfigStore";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { useDetectorStore } from "../data-entry/detectorStore";
import ResultsBar, { ResultsConfig } from "../results/resultsBar";
import LegendBar from "./legendBar";
import { usePlotStore } from "./plotStore";
import { color2String, getDomain } from "./plotUtils";
import SvgAxisAlignedEllipse from "./svgEllipse";
import { useMemo, useState, useCallback } from "react";
import {
  ReciprocalWavelengthUnits,
  WavelengthUnits,
  formatLogMessage,
} from "../utils/units";
import SvgMask from "./svgMask";
import { createPlots } from "./plotter";
import UnitRange from "../calculations/unitRange";
import {
  ScatteringOptions,
  convertFromDtoQ,
  convertFromSToQ,
} from "../results/scatteringQuantities";
import SvgCalibrant from "./svgCalibrant";
import { AppDetector } from "../utils/types";

// Stable selector defined outside the component so its reference never changes
const detectorSelector = (state: { detector: AppDetector }) => state.detector;

/** Converts a scalar value to a mathjs Unit in q-space based on the current display config. */
function getUnit(value: number, config: ResultsConfig): Unit {
  if (config.requested === ScatteringOptions.d) {
    return convertFromDtoQ(unit(value, config.dUnits));
  }
  if (config.requested === ScatteringOptions.s) {
    return convertFromSToQ(unit(value, config.sUnits));
  }
  return unit(value, config.qUnits);
}

/**
 * A react componenet that plots a diagram of the system
 * @returns
 */
export default function CentrePlot(): React.JSX.Element {
  const plotConfig = usePlotStore();
  const beamlineConfig = useBeamlineConfigStore((s) => s.beamline);
  const detector = useDetectorStore(detectorSelector);
  const beamstop = useBeamstopStore((s) => s.beamstop);
  const cameraTube = useCameraTubeStore((s) => s.cameraTube);
  const [resultsConfig, setResultsConfig] = useState<ResultsConfig>({
    requested: ScatteringOptions.q,
    qUnits: ReciprocalWavelengthUnits.nanometres,
    sUnits: ReciprocalWavelengthUnits.nanometres,
    dUnits: WavelengthUnits.nanometres,
    requestedMin: null,
    requestedMax: null,
  });
  const updateResultsConfig = useCallback(
    (partial: Partial<ResultsConfig>) =>
      setResultsConfig((prev) => ({ ...prev, ...partial })),
    [],
  );
  const requestedRange = useMemo<UnitRange | null>(
    () =>
      resultsConfig.requestedMin != null && resultsConfig.requestedMax != null
        ? new UnitRange(
            getUnit(resultsConfig.requestedMin, resultsConfig),
            getUnit(resultsConfig.requestedMax, resultsConfig),
          )
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resultsConfig.requestedMin, resultsConfig.requestedMax, resultsConfig.requested, resultsConfig.qUnits, resultsConfig.sUnits, resultsConfig.dUnits],
  );
  const calibrant = plotConfig.calibrantRecord[plotConfig.currentCalibrant];

  // Update pixel units and calculate qrange together — updatePixelUnits must
  // run before computeQrange since both the Plotter and qrange calculation
  // depend on the "xpixel"/"ypixel" mathjs units being registered first.
  const { minPoint, maxPoint, visibleQRange } = useMemo(() => {
    updatePixelUnits(detector);
    console.info(formatLogMessage("Calculating Q range"));
    return computeQrange(detector, beamstop, beamlineConfig, cameraTube);
  }, [detector, beamstop, cameraTube, beamlineConfig]);

  const {
    plotBeamstop,
    plotCameraTube,
    plotDetector,
    plotClearance,
    plotVisibleRange,
    plotRequestedRange,
    plotCalibrant,
    domains,
  } = useMemo(() => {
    const {
      plotBeamstop,
      plotCameraTube,
      plotDetector,
      plotClearance,
      plotVisibleRange,
      plotRequestedRange,
      plotCalibrant,
    } = createPlots(
      beamstop,
      detector,
      beamlineConfig,
      calibrant,
      minPoint,
      maxPoint,
      requestedRange,
      plotConfig.plotAxes,
      cameraTube,
    );
    return {
      plotBeamstop,
      plotCameraTube,
      plotDetector,
      plotClearance,
      plotVisibleRange,
      plotRequestedRange,
      plotCalibrant,
      domains: getDomain(
        plotDetector.lowerBound,
        plotDetector.upperBound,
        plotBeamstop.centre,
        plotBeamstop.endPointX,
        plotBeamstop.endPointY,
      ),
    };
  }, [
    beamstop,
    detector,
    beamlineConfig,
    calibrant,
    minPoint,
    maxPoint,
    requestedRange,
    plotConfig.plotAxes,
    cameraTube,
  ]);
  return (
    <Stack
      direction="column"
      spacing={1}
      maxHeight={{ lg: "calc(98vh - 70px)" }}
      overflow={{ lg: "scroll" }}
      flexGrow={1}
    >
      <Stack direction={{ sm: "column", md: "row" }} spacing={1} flexGrow={1}>
        <Card variant="outlined" sx={{ aspectRatio: 1.07 / 1 }}>
          <CardContent sx={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                display: "grid",
                width: "100%",
                height: "100%",
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <VisCanvas
                aspect={1}
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
                    plotCalibrant.endPointX,
                    plotCalibrant.endPointY,
                  ]}
                >
                  {(
                    beamstopCentre,
                    beamstopEndPointX,
                    beamstopEndPointY,
                    clearanceCentre,
                    clearanceEndPointX,
                    clearanceEndPointY,
                    cameraTubeCentre,
                    cameraTubeEndPointX,
                    cameraTubeEndPointY,
                    detectorLower,
                    detectorUpper,
                    visibleRangeStart,
                    visibleRangeEnd,
                    requestedRangeStart,
                    requestedRangeEnd,
                    calibrantEndPointX,
                    calibrantEndPointY,
                  ) => (
                    <SvgElement>
                      {plotConfig.cameraTube && cameraTube && (
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
                      {plotConfig.mask && detector.mask && (
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
                      {plotConfig.calibrant && (
                        <SvgCalibrant
                          beamCentre={beamstopCentre}
                          endPointX={calibrantEndPointX}
                          endPointY={calibrantEndPointY}
                          ringFractions={plotCalibrant.ringFractions}
                          fill="transparent"
                          stroke={color2String(plotConfig.calibrantColor)}
                          strokeWidth="3"
                          id="calibrant"
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
                            clearanceEndPointX,
                            clearanceEndPointY,
                          ]}
                          fill={color2String(plotConfig.clearanceColor)}
                          id="clearance"
                        />
                      )}
                      {plotConfig.visibleRange && (
                        <SvgLine
                          coords={[visibleRangeStart, visibleRangeEnd]}
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
                      {plotConfig.beamstop &&  (
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
            </Box>
          </CardContent>
        </Card>
        <LegendBar />
      </Stack>
      <ResultsBar
        visibleQRange={visibleQRange}
        config={resultsConfig}
        updateConfig={updateResultsConfig}
      />
    </Stack>
  );
}

function updatePixelUnits(detector: AppDetector): void {
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
  createUnit("xpixel", detector.pixelSize.width.toString());
  createUnit("ypixel", detector.pixelSize.height.toString());
  /* eslint-enable */
}
