import { expect, test } from "vitest";
import { toSegments, remapSegmentsToSubRange } from "./segmentUtils";
import NumericRange from "../calculations/numericRange";

// --- toSegments ---

test("toSegments returns [[0,1]] when accessible list is empty", () => {
  const full = new NumericRange(0, 10);
  expect(toSegments([], full)).toEqual([[0, 1]]);
});

test("toSegments returns [] when the full range has zero span", () => {
  const full = new NumericRange(5, 5);
  const accessible = [new NumericRange(5, 5)];
  expect(toSegments(accessible, full)).toEqual([]);
});

test("toSegments maps a single accessible range covering the full range to [[0,1]]", () => {
  const full = new NumericRange(0, 10);
  const accessible = [new NumericRange(0, 10)];
  expect(toSegments(accessible, full)).toEqual([[0, 1]]);
});

test("toSegments maps a sub-range to the correct fractions", () => {
  // accessible [2,8] within full [0,10] → [0.2, 0.8]
  const full = new NumericRange(0, 10);
  const accessible = [new NumericRange(2, 8)];
  const result = toSegments(accessible, full);
  expect(result).toHaveLength(1);
  expect(result[0][0]).toBeCloseTo(0.2);
  expect(result[0][1]).toBeCloseTo(0.8);
});

test("toSegments handles two accessible sub-ranges with a gap", () => {
  // [0,4] and [6,10] within [0,10] → [0,0.4] and [0.6,1]
  const full = new NumericRange(0, 10);
  const accessible = [new NumericRange(0, 4), new NumericRange(6, 10)];
  const result = toSegments(accessible, full);
  expect(result).toHaveLength(2);
  expect(result[0][0]).toBeCloseTo(0);
  expect(result[0][1]).toBeCloseTo(0.4);
  expect(result[1][0]).toBeCloseTo(0.6);
  expect(result[1][1]).toBeCloseTo(1);
});

test("toSegments filters out accessible ranges entirely outside the full range", () => {
  // accessible [20,30] is entirely outside full [0,10]
  const full = new NumericRange(0, 10);
  const accessible = [new NumericRange(20, 30)];
  expect(toSegments(accessible, full)).toEqual([]);
});

test("toSegments clamps accessible ranges that partially extend outside", () => {
  // accessible [-5, 5] within full [0,10] → clamped to [0, 0.5]
  const full = new NumericRange(0, 10);
  const accessible = [new NumericRange(-5, 5)];
  const result = toSegments(accessible, full);
  expect(result).toHaveLength(1);
  expect(result[0][0]).toBeCloseTo(0);
  expect(result[0][1]).toBeCloseTo(0.5);
});

// --- remapSegmentsToSubRange ---

test("remapSegmentsToSubRange returns [] when span is zero", () => {
  expect(remapSegmentsToSubRange([[0, 1]], 0.5, 0.5)).toEqual([]);
});

test("remapSegmentsToSubRange returns [] when span is negative", () => {
  expect(remapSegmentsToSubRange([[0, 1]], 0.8, 0.2)).toEqual([]);
});

test("remapSegmentsToSubRange maps segments covering the full sub-range to [[0,1]]", () => {
  // segment [0.2, 0.8], sub-range [0.2, 0.8] → [0, 1]
  const result = remapSegmentsToSubRange([[0.2, 0.8]], 0.2, 0.8);
  expect(result).toHaveLength(1);
  expect(result[0][0]).toBeCloseTo(0);
  expect(result[0][1]).toBeCloseTo(1);
});

test("remapSegmentsToSubRange clips segments to the sub-range and remaps", () => {
  // full segment [0,1], sub-range [0.25, 0.75]
  // overlap is [0.25, 0.75], remapped over span 0.5 → [0, 1]
  const result = remapSegmentsToSubRange([[0, 1]], 0.25, 0.75);
  expect(result).toHaveLength(1);
  expect(result[0][0]).toBeCloseTo(0);
  expect(result[0][1]).toBeCloseTo(1);
});

test("remapSegmentsToSubRange drops segments outside the sub-range", () => {
  // segment [0, 0.1] is entirely outside sub-range [0.5, 1.0]
  const result = remapSegmentsToSubRange([[0, 0.1]], 0.5, 1.0);
  expect(result).toEqual([]);
});

test("remapSegmentsToSubRange remaps a partial overlap correctly", () => {
  // segment [0.5, 1.0] within sub-range [0.25, 0.75]
  // overlap: [0.5, 0.75], span=0.5 → [(0.5-0.25)/0.5, (0.75-0.25)/0.5] = [0.5, 1.0]
  const result = remapSegmentsToSubRange([[0.5, 1.0]], 0.25, 0.75);
  expect(result).toHaveLength(1);
  expect(result[0][0]).toBeCloseTo(0.5);
  expect(result[0][1]).toBeCloseTo(1.0);
});
