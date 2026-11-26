import { expect, test } from "vitest";
import { unit } from "mathjs";
import { Vector2 } from "three";
import { createPlots } from "./plotter";
import { calculateQValue } from "../calculations/qvalue";
import { PlotAxes } from "./plotStore";
import { createInternalDetector } from "../presets/presetManager";
import { AppBeamline, AppBeamstop, Calibrant } from "../utils/types";

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

function plots(
  axes: PlotAxes,
  {
    calibrant = { d: [] } as Calibrant,
    beamlineConfig = beamline,
    maxPoint = new Vector2(0.1, 0.05),
  } = {},
) {
  return createPlots(
    beamstop,
    detector,
    beamlineConfig,
    calibrant,
    new Vector2(0.05, 0.05),
    maxPoint,
    null,
    axes,
  );
}

// Camera length 5 cm: the +x detector edge (r = 50 mm) is at 2θ = 45°,
// where the small-angle approximation overestimates q by ~31%.
const wideAngle: AppBeamline = { ...beamline, cameraLength: 0.05 };

/** Exact q in nm⁻¹ at distance r (m) for L (m) and λ (m). */
const qNm = (r: number, L: number, lambda: number) =>
  calculateQValue(r, L, lambda)! * 1e-9;

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

test("calibrant rings beyond 2θ = 90° are not drawn", () => {
  // λ = 0.1 nm: rings need d > λ/√2 ≈ 0.071 nm, so d = 0.05 nm is unreachable
  const { plotCalibrant } = plots(PlotAxes.millimetre, {
    calibrant: { d: [1, 0.5, 0.05] },
  });
  expect(plotCalibrant.ringFractions).toHaveLength(2);
  expect(plotCalibrant.ringFractions.every((f) => f > 0)).toBe(true);
});

test("calibrant ring fractions are relative to the outermost reachable ring", () => {
  const { plotCalibrant } = plots(PlotAxes.millimetre, {
    calibrant: { d: [1, 0.5, 0.05] },
  });
  // The smallest reachable d (0.5 nm) is the outermost ring
  expect(Math.max(...plotCalibrant.ringFractions)).toBeCloseTo(1);
});

// --- reciprocal (q) axes ---

test("q axes put the beam centre at the origin", () => {
  const { plotBeamstop } = plots(PlotAxes.reciprocal, {
    beamlineConfig: wideAngle,
  });
  expect(plotBeamstop.centre.x).toBeCloseTo(0);
  expect(plotBeamstop.centre.y).toBeCloseTo(0);
});

test("q axes give the exact q at wide angles", () => {
  // Visible range ends at the +x edge, 50 mm from the beam centre
  const { plotVisibleRange } = plots(PlotAxes.reciprocal, {
    beamlineConfig: wideAngle,
  });
  expect(plotVisibleRange.end.x / qNm(0.05, 0.05, 0.1e-9)).toBeCloseTo(1, 6);
  expect(plotVisibleRange.end.y).toBeCloseTo(0);
});

test("q axes keep a point's direction from the beam centre", () => {
  // 30 mm right and 40 mm down from the centre: r = 50 mm, direction (0.6, 0.8)
  const { plotVisibleRange } = plots(PlotAxes.reciprocal, {
    beamlineConfig: wideAngle,
    maxPoint: new Vector2(0.08, 0.09),
  });
  const q = qNm(0.05, 0.05, 0.1e-9);
  expect(plotVisibleRange.end.x / (0.6 * q)).toBeCloseTo(1, 6);
  expect(plotVisibleRange.end.y / (0.8 * q)).toBeCloseTo(1, 6);
});

test("on q axes, calibrant ring radii are proportional to q", () => {
  // q = 2π/d, so rings at d = 0.5 and 0.2 nm have radii in ratio 0.4 : 1
  const { plotCalibrant } = plots(PlotAxes.reciprocal, {
    beamlineConfig: wideAngle,
    calibrant: { d: [0.5, 0.2] },
  });
  expect(plotCalibrant.ringFractions[0]).toBeCloseTo(0.4, 6);
  expect(plotCalibrant.ringFractions[1]).toBeCloseTo(1, 6);
});

test("on mm axes, calibrant ring radii are proportional to detector distance", () => {
  // tan(2θ) ratio for d = 0.5 and 0.2 nm at λ = 0.1 nm, not the q ratio
  const tan2theta = (d: number) => Math.tan(2 * Math.asin(0.1 / (2 * d)));
  const { plotCalibrant } = plots(PlotAxes.millimetre, {
    beamlineConfig: wideAngle,
    calibrant: { d: [0.5, 0.2] },
  });
  expect(plotCalibrant.ringFractions[0]).toBeCloseTo(
    tan2theta(0.5) / tan2theta(0.2),
    6,
  );
});
