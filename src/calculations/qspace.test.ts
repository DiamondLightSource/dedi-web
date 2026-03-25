import { expect, test } from "vitest";
import { Vector2, Vector3 } from "three";
import QSpace from "./qspace";

// All tests use a beam along the +z axis with the detector perpendicular to it.
// Setting λ = 2π gives kMag = 1, which keeps the expected values clean.
//
// origin = (0, 0, L) places the beam centre at (0,0) on the detector.
// A pixel at position (px, py) is at Euclidean distance sqrt(px²+py²+L²) from
// the sample, giving scattering angle 2θ where tan(2θ) = sqrt(px²+py²) / L.

const makeQSpace = (cameraLength: number, wavelength: number) =>
  new QSpace(
    { origin: new Vector3(0, 0, cameraLength), beamVector: new Vector3(0, 0, 1) },
    wavelength,
  );

// --- beam centre ---

test("pixel at the beam centre gives |q| = 0", () => {
  const qs = makeQSpace(1, 2 * Math.PI);
  expect(qs.qFromPixelPosition(new Vector2(0, 0)).length()).toBeCloseTo(0);
});

// --- symmetry ---

test("pixels equidistant from beam centre give the same |q| regardless of direction", () => {
  const qs = makeQSpace(1, 2 * Math.PI);
  const qX = qs.qFromPixelPosition(new Vector2(0.5, 0)).length();
  const qY = qs.qFromPixelPosition(new Vector2(0, 0.5)).length();
  expect(qX).toBeCloseTo(qY);
});

// --- monotonicity ---

test("larger pixel offset from beam centre gives larger |q|", () => {
  const qs = makeQSpace(1, 2 * Math.PI);
  const qNear = qs.qFromPixelPosition(new Vector2(0.1, 0)).length();
  const qFar = qs.qFromPixelPosition(new Vector2(0.5, 0)).length();
  expect(qFar).toBeGreaterThan(qNear);
});

// --- known value ---

test("pixel at 45-degree scatter gives the correct |q|", () => {
  // Setup: λ = 2π → kMag = 1, camera length L = 1, pixel at (1, 0)
  // Scattering angle: tan(2θ) = 1/1 = 1 → 2θ = 45° → θ = 22.5°
  // q = 2·kMag·sin(θ) = 2·sin(22.5°)
  //
  // Equivalently from first principles:
  //   displacement = (-1, 0, 0) + (0, 0, 1) = (-1, 0, 1), length = √2
  //   k_f = (-1/√2, 0, 1/√2)
  //   q = k_f + negKi = (-1/√2, 0, 1/√2 - 1)
  //   |q|² = 1/2 + (1/√2 - 1)² = 2 - √2
  const qs = makeQSpace(1, 2 * Math.PI);
  const q = qs.qFromPixelPosition(new Vector2(1, 0));
  expect(q.length()).toBeCloseTo(Math.sqrt(2 - Math.sqrt(2)));
});

// --- setWavelength ---

test("halving the wavelength doubles |q| for the same pixel position", () => {
  // kMag = 2π/λ, so halving λ doubles kMag and therefore doubles |q|
  const qs = makeQSpace(1, 2 * Math.PI); // kMag = 1
  const pixel = new Vector2(1, 0);

  const q1 = qs.qFromPixelPosition(pixel).length();
  qs.setWavelength(Math.PI); // kMag = 2
  const q2 = qs.qFromPixelPosition(pixel).length();

  expect(q2).toBeCloseTo(2 * q1);
});

test("setWavelength does not affect the beam-centre result of |q| = 0", () => {
  const qs = makeQSpace(1, 2 * Math.PI);
  qs.setWavelength(0.5);
  expect(qs.qFromPixelPosition(new Vector2(0, 0)).length()).toBeCloseTo(0);
});
