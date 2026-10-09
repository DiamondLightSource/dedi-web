import { expect, test } from "vitest";
import { unit } from "mathjs";
import { Vector2 } from "three";
import { createPlots } from "./plotter";
import { PlotAxes } from "./plotStore";
import { createInternalDetector } from "../presets/presetManager";
import { AppBeamline, AppBeamstop } from "../utils/types";

const detector = createInternalDetector({
  resolution: { width: 1000, height: 500 },
  pixelSize: { width: 0.1, height: 0.2 },
});

const beamstop: AppBeamstop = {
  centre: { x: 500, y: 250 },
  diameter: unit(4, "mm"),
  clearance: 10,
};

const beamline: AppBeamline = {
  wavelengthLimits: { min: unit(0.05, "nm"), max: unit(0.2, "nm") },
  cameraLimits: { min: unit(1, "m"), max: unit(10, "m"), step: unit(0.5, "m") },
  wavelength: unit(0.1, "nm"),
  angle: unit(0, "deg"),
  cameraLength: 1,
};

function plots(axes: PlotAxes) {
  return createPlots(
    beamstop,
    detector,
    beamline,
    { d: [] },
    new Vector2(0.05, 0.05),
    new Vector2(0.1, 0.05),
    null,
    axes,
  );
}

test("pixel axes place the detector corner at its resolution", () => {
  const { plotDetector } = plots(PlotAxes.pixel);
  expect(plotDetector.upperBound.x).toBeCloseTo(1000);
  expect(plotDetector.upperBound.y).toBeCloseTo(500);
});

test("millimetre axes scale x and y by their own pixel sizes", () => {
  const { plotDetector, plotBeamstop } = plots(PlotAxes.millimetre);
  expect(plotDetector.upperBound.x).toBeCloseTo(100);
  expect(plotDetector.upperBound.y).toBeCloseTo(100);
  expect(plotBeamstop.centre.x).toBeCloseTo(50);
  expect(plotBeamstop.centre.y).toBeCloseTo(50);
});

test("pixel axes convert the visible range end points back to pixels", () => {
  const { plotVisibleRange } = plots(PlotAxes.pixel);
  expect(plotVisibleRange.start.x).toBeCloseTo(500);
  expect(plotVisibleRange.start.y).toBeCloseTo(250);
  expect(plotVisibleRange.end.x).toBeCloseTo(1000);
});

test("clearance extends the beamstop radius by its pixel count on each axis", () => {
  // radius 2 mm + 10 px: x → 2 + 1 = 3 mm, y → 2 + 2 = 4 mm
  const { plotClearance } = plots(PlotAxes.millimetre);
  expect(plotClearance.endPointX.x - plotClearance.centre.x).toBeCloseTo(3);
  expect(plotClearance.endPointY.y - plotClearance.centre.y).toBeCloseTo(4);
});
