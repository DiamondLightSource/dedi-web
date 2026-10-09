import { expect, test } from "vitest";
import { unit } from "mathjs";
import { computeQrange } from "./qrange";
import { createInternalDetector } from "../presets/presetManager";
import { AppBeamline, AppBeamstop } from "../utils/types";

// A 100 mm × 100 mm detector with non-square pixels (0.1 mm wide, 0.2 mm
// tall), so mixing up the x and y pixel sizes changes the answer.
const detector = createInternalDetector({
  resolution: { width: 1000, height: 500 },
  pixelSize: { width: 0.1, height: 0.2 },
});

// Point beamstop (no diameter, no clearance) in the middle of the detector.
const beamstop: AppBeamstop = {
  centre: { x: 500, y: 250 },
  diameter: unit(0, "mm"),
  clearance: 0,
};

function beamline(angleDeg: number): AppBeamline {
  return {
    wavelengthLimits: { min: unit(0.05, "nm"), max: unit(0.2, "nm") },
    cameraLimits: {
      min: unit(1, "m"),
      max: unit(10, "m"),
      step: unit(0.5, "m"),
    },
    wavelength: unit(0.1, "nm"),
    angle: unit(angleDeg, "deg"),
    cameraLength: 1,
  };
}

/** q = 4π·sin(θ)/λ with tan(2θ) = r/L, in m⁻¹. */
const qAt = (r: number, L: number, lambda: number) =>
  (4 * Math.PI * Math.sin(Math.atan(r / L) / 2)) / lambda;

test("computeQrange runs without any global pixel units registered", () => {
  expect(() => computeQrange(detector, beamstop, beamline(0))).not.toThrow();
});

test("computeQrange gives the visible q-range along +x", () => {
  // Beam centre at x = 50 mm; the +x edge is at 100 mm → r from 0 to 50 mm.
  const { visibleQRange } = computeQrange(detector, beamstop, beamline(0));
  expect(visibleQRange?.min).toBeCloseTo(0);
  expect(visibleQRange!.max / qAt(0.05, 1, 0.1e-9)).toBeCloseTo(1, 6);
});

test("computeQrange uses the pixel height along y", () => {
  // Beam centre at y = 250 px × 0.2 mm = 50 mm; the edge is at 100 mm.
  const { visibleQRange } = computeQrange(detector, beamstop, beamline(90));
  expect(visibleQRange!.max / qAt(0.05, 1, 0.1e-9)).toBeCloseTo(1, 6);
});

test("computeQrange returns no visible range when the detector is behind the beam", () => {
  // Beam centre left of the detector, scattering further left.
  const offDetector: AppBeamstop = { ...beamstop, centre: { x: -100, y: 250 } };
  const { visibleQRange } = computeQrange(detector, offDetector, beamline(180));
  expect(visibleQRange).toBeNull();
});
