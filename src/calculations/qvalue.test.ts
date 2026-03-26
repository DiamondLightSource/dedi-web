import { expect, test } from "vitest";
import { calculateQValue, calculateDistanceFromQValue } from "./qvalue";

// --- calculateQValue ---

test("calculateQValue returns null when cameraLength is 0", () => {
  expect(calculateQValue(1, 0, 1)).toBeNull();
});

test("calculateQValue returns null when wavelength is 0", () => {
  expect(calculateQValue(1, 1, 0)).toBeNull();
});

test("calculateQValue returns null for negative cameraLength", () => {
  expect(calculateQValue(1, -1, 1)).toBeNull();
});

test("calculateQValue returns null for negative distance", () => {
  expect(calculateQValue(-1, 1, 1)).toBeNull();
});

test("calculateQValue returns null for negative wavelength", () => {
  expect(calculateQValue(1, 1, -1)).toBeNull();
});

test("calculateQValue returns 0 when distance is 0 (beam centre)", () => {
  expect(calculateQValue(0, 1, 1)).toBeCloseTo(0);
});

test("calculateQValue returns a positive value for positive inputs", () => {
  const q = calculateQValue(1, 1, 1);
  expect(q).not.toBeNull();
  expect(q!).toBeGreaterThan(0);
});

test("calculateQValue increases with distance", () => {
  const q1 = calculateQValue(1, 5, 1)!;
  const q2 = calculateQValue(2, 5, 1)!;
  expect(q2).toBeGreaterThan(q1);
});

test("calculateQValue decreases with longer camera length", () => {
  const q1 = calculateQValue(1, 2, 1)!;
  const q2 = calculateQValue(1, 5, 1)!;
  expect(q2).toBeLessThan(q1);
});

test("calculateQValue decreases with longer wavelength", () => {
  const q1 = calculateQValue(1, 5, 1)!;
  const q2 = calculateQValue(1, 5, 2)!;
  expect(q2).toBeLessThan(q1);
});

// --- calculateDistanceFromQValue ---

test("calculateDistanceFromQValue returns null for negative qValue", () => {
  expect(calculateDistanceFromQValue(-1, 1, 1)).toBeNull();
});

test("calculateDistanceFromQValue returns null for negative cameraLength", () => {
  expect(calculateDistanceFromQValue(1, -1, 1)).toBeNull();
});

test("calculateDistanceFromQValue returns null for negative wavelength", () => {
  expect(calculateDistanceFromQValue(1, 1, -1)).toBeNull();
});

test("calculateDistanceFromQValue returns null when qValue is physically unreachable", () => {
  // temp = (λ * q) / (4π) must be < √2/2 ≈ 0.707
  // With λ=1, q=100: temp >> 0.707 → null
  expect(calculateDistanceFromQValue(100, 1, 1)).toBeNull();
});

test("calculateDistanceFromQValue returns 0 when qValue is 0", () => {
  expect(calculateDistanceFromQValue(0, 5, 1)).toBeCloseTo(0);
});

// --- round-trip: calculateQValue ∘ calculateDistanceFromQValue ≈ identity ---

test("round-trip: converting q to distance and back recovers the original q", () => {
  const q = 1.5;
  const cameraLength = 3;
  const wavelength = 0.1;
  const distance = calculateDistanceFromQValue(q, cameraLength, wavelength)!;
  expect(distance).not.toBeNull();
  const recovered = calculateQValue(distance, cameraLength, wavelength)!;
  expect(recovered).toBeCloseTo(q, 5);
});
