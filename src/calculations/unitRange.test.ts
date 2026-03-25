import { expect, test } from "vitest";
import UnitRange from "./unitRange";
import NumericRange from "./numericRange";
import * as mathjs from "mathjs";

// --- constructor ---

test("constructor stores min and max", () => {
  const r = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(5, "m"));
  expect(r.min.toNumber("m")).toBeCloseTo(2);
  expect(r.max.toNumber("m")).toBeCloseTo(5);
});

test("constructor swaps values when min > max", () => {
  const r = new UnitRange(mathjs.unit(8, "m"), mathjs.unit(3, "m"));
  expect(r.min.toNumber("m")).toBeCloseTo(3);
  expect(r.max.toNumber("m")).toBeCloseTo(8);
});

test("constructor throws when units have incompatible base dimensions", () => {
  expect(() =>
    new UnitRange(mathjs.unit(1, "m"), mathjs.unit(1, "kg")),
  ).toThrow();
});

// --- to ---

test("to converts both bounds to the target unit", () => {
  const r = new UnitRange(mathjs.unit(1, "m"), mathjs.unit(2, "m"));
  const converted = r.to("cm");
  expect(converted.min.toNumber("cm")).toBeCloseTo(100);
  expect(converted.max.toNumber("cm")).toBeCloseTo(200);
});

// --- containsRange ---

test("containsRange returns true when other is fully inside (mixed units)", () => {
  // 1 m to 10 m contains 300 cm (=3 m) to 500 cm (=5 m)
  const outer = new UnitRange(mathjs.unit(1, "m"), mathjs.unit(10, "m"));
  const inner = new UnitRange(mathjs.unit(300, "cm"), mathjs.unit(500, "cm"));
  expect(outer.containsRange(inner)).toBe(true);
});

test("containsRange returns false when other extends beyond the range", () => {
  const r1 = new UnitRange(mathjs.unit(1, "m"), mathjs.unit(5, "m"));
  const r2 = new UnitRange(mathjs.unit(3, "m"), mathjs.unit(8, "m"));
  expect(r1.containsRange(r2)).toBe(false);
});

// --- fromNumericRange ---

test("fromNumericRange creates a UnitRange with correct values", () => {
  const numRange = new NumericRange(2, 5);
  const unitRange = UnitRange.fromNumericRange(numRange, "m");
  expect(unitRange.min.toNumber("m")).toBeCloseTo(2);
  expect(unitRange.max.toNumber("m")).toBeCloseTo(5);
});

// --- apply ---

test("apply transforms min and max with the given function", () => {
  const r = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(4, "m"));
  // multiply each bound by 3 m → units become m²
  const result = r.apply((v) => v.multiply(mathjs.unit(3, "m")));
  expect(result.min.toNumber("m^2")).toBeCloseTo(6);
  expect(result.max.toNumber("m^2")).toBeCloseTo(12);
});

