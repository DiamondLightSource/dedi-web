import { expect, test } from "vitest";
import { Vector3 } from "three";
import { getDomain } from "./plotUtils";

// Helper: build a Vector3 array from [x, y] pairs
const pts = (...coords: [number, number][]) =>
  coords.map(([x, y]) => new Vector3(x, y, 0));

// --- required points only ---

test("getDomain with a single required point produces a non-degenerate domain", () => {
  const { xAxis, yAxis } = getDomain(pts([5, 10]), []);
  // With one point the padding is 0, but the range should be defined
  expect(xAxis.min).toBeLessThanOrEqual(5);
  expect(xAxis.max).toBeGreaterThanOrEqual(5);
  expect(yAxis.min).toBeLessThanOrEqual(10);
  expect(yAxis.max).toBeGreaterThanOrEqual(10);
});

test("getDomain includes all required points with at least 10% padding", () => {
  // required bbox: x [0,10], y [0,10] → extent=10, pad=1 → domain [-1,11]
  const { xAxis, yAxis } = getDomain(pts([0, 0], [10, 10]), []);
  expect(xAxis.min).toBeCloseTo(-1);
  expect(xAxis.max).toBeCloseTo(11);
  expect(yAxis.min).toBeCloseTo(-1);
  expect(yAxis.max).toBeCloseTo(11);
});

// --- optional points within budget ---

test("getDomain includes an optional point when it is within the expansion budget", () => {
  // required: x [0,10], y [0,10] — base extent=12 (after padding)
  // optional: (12, 5) — x extent would grow from 12 to 13: 13/12 ≈ 1.08 < 1.5 → included
  const { xAxis } = getDomain(pts([0, 0], [10, 10]), pts([12, 5]));
  expect(xAxis.max).toBeGreaterThanOrEqual(12);
});

// --- optional points outside budget ---

test("getDomain excludes an optional point that would expand the domain beyond maxExpansion", () => {
  // required: x [0,10], y [0,10] — base x extent=12 (padding 10%)
  // optional: (1000, 5) — x extent would become 1011, far beyond 1.5x budget → excluded
  const { xAxis } = getDomain(pts([0, 0], [10, 10]), pts([1000, 5]));
  expect(xAxis.max).toBeLessThan(100);
});

test("getDomain excludes optional point that expands one axis but not the other", () => {
  // required: x [0,10], y [0,10]
  // optional: (5, 1000) — y would blow out, x is fine
  const { xAxis, yAxis } = getDomain(pts([0, 0], [10, 10]), pts([5, 1000]));
  // x should still be the padded required range
  expect(xAxis.max).toBeCloseTo(11);
  // y should not include 1000
  expect(yAxis.max).toBeLessThan(100);
});

// --- custom maxExpansion ---

test("getDomain respects a custom maxExpansion of 1.0 (no expansion allowed)", () => {
  // With maxExpansion=1.0, any optional point that increases extent is rejected
  const { xAxis } = getDomain(pts([0, 0], [10, 10]), pts([12, 5]), 1.0);
  expect(xAxis.max).toBeCloseTo(11); // only padded required range
});

test("getDomain respects a custom maxExpansion of 3.0 (generous budget)", () => {
  // required x domain: [-1, 11], extent = 12; maxExpansion=3.0 → max allowed extent = 36
  // optional at x=100: extent would be 101 → 101/12 ≈ 8.4 > 3 → excluded
  // optional at x=25:  extent would be 26  → 26/12  ≈ 2.2 < 3 → included
  const { xAxis: tight } = getDomain(pts([0, 0], [10, 10]), pts([100, 5]), 3.0);
  const { xAxis: wide } = getDomain(pts([0, 0], [10, 10]), pts([25, 5]), 3.0);
  expect(tight.max).toBeLessThan(50);
  expect(wide.max).toBeGreaterThanOrEqual(25);
});
