import { expect, test } from "vitest";
import NumericRange from "./numericRange";

// --- constructor ---

test("constructor stores min and max", () => {
  const r = new NumericRange(2, 7);
  expect(r.min).toBe(2);
  expect(r.max).toBe(7);
});

test("constructor swaps values when min > max", () => {
  const r = new NumericRange(9, 3);
  expect(r.min).toBe(3);
  expect(r.max).toBe(9);
});

// --- containsValue ---

test("containsValue returns true for values strictly inside range", () => {
  const r = new NumericRange(1, 10);
  expect(r.containsValue(5)).toBe(true);
});

test("containsValue returns true at the min boundary", () => {
  const r = new NumericRange(1, 10);
  expect(r.containsValue(1)).toBe(true);
});

test("containsValue returns true at the max boundary", () => {
  const r = new NumericRange(1, 10);
  expect(r.containsValue(10)).toBe(true);
});

test("containsValue returns false below range", () => {
  const r = new NumericRange(1, 10);
  expect(r.containsValue(0)).toBe(false);
});

test("containsValue returns false above range", () => {
  const r = new NumericRange(1, 10);
  expect(r.containsValue(11)).toBe(false);
});

// --- containsRange ---

test("containsRange returns true when other is fully inside", () => {
  const outer = new NumericRange(1, 10);
  const inner = new NumericRange(3, 7);
  expect(outer.containsRange(inner)).toBe(true);
});

test("containsRange returns true when ranges share a boundary", () => {
  const r1 = new NumericRange(1, 10);
  const r2 = new NumericRange(1, 5);
  expect(r1.containsRange(r2)).toBe(true);
});

test("containsRange returns false when other extends beyond max", () => {
  const r1 = new NumericRange(1, 5);
  const r2 = new NumericRange(3, 8);
  expect(r1.containsRange(r2)).toBe(false);
});

test("containsRange returns false when ranges are disjoint", () => {
  const r1 = new NumericRange(1, 5);
  const r2 = new NumericRange(6, 10);
  expect(r1.containsRange(r2)).toBe(false);
});

// --- intersect ---

test("intersect returns the overlapping portion of two ranges", () => {
  const r1 = new NumericRange(1, 5);
  const r2 = new NumericRange(3, 8);
  const result = r1.intersect(r2);
  expect(result?.min).toBe(3);
  expect(result?.max).toBe(5);
});

test("intersect returns the inner range when one contains the other", () => {
  const outer = new NumericRange(1, 10);
  const inner = new NumericRange(3, 7);
  const result = outer.intersect(inner);
  expect(result?.min).toBe(3);
  expect(result?.max).toBe(7);
});

test("intersect returns null for disjoint ranges", () => {
  const r1 = new NumericRange(1, 4);
  const r2 = new NumericRange(6, 10);
  expect(r1.intersect(r2)).toBeNull();
});

test("intersect returns null when input is null", () => {
  const r = new NumericRange(1, 10);
  expect(r.intersect(null)).toBeNull();
});

