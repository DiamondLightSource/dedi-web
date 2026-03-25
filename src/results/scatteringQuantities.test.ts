import { expect, test } from "vitest";
import { unit } from "mathjs";
import {
  convertFromQToS,
  convertFromSToQ,
  convertFromQtoD,
} from "./scatteringQuantities";

// q and s are related by:  s = q / (2π)  ↔  q = s * 2π
// q and d are related by:  d = 2π / q     (same formula both ways)

// --- convertFromQToS ---

test("convertFromQToS multiplies q by 2π to give s", () => {
  const q = unit(1, "nm^-1");
  const s = convertFromQToS(q);
  expect(s.toNumber("nm^-1")).toBeCloseTo(2 * Math.PI);
});

test("convertFromQToS scales linearly", () => {
  const q1 = unit(2, "nm^-1");
  const q2 = unit(4, "nm^-1");
  const ratio =
    convertFromQToS(q2).toNumber("nm^-1") /
    convertFromQToS(q1).toNumber("nm^-1");
  expect(ratio).toBeCloseTo(2);
});

// --- convertFromSToQ ---

test("convertFromSToQ divides s by 2π to give q", () => {
  const s = unit(2 * Math.PI, "nm^-1");
  const q = convertFromSToQ(s);
  expect(q.toNumber("nm^-1")).toBeCloseTo(1);
});

// --- convertFromQToS and convertFromSToQ are inverses ---

test("convertFromSToQ(convertFromQToS(q)) round-trips back to q", () => {
  const q = unit(3, "nm^-1");
  const recovered = convertFromSToQ(convertFromQToS(q));
  expect(recovered.toNumber("nm^-1")).toBeCloseTo(3);
});

// --- convertFromQtoD ---

test("convertFromQtoD gives d = 2π / q", () => {
  const q = unit(2 * Math.PI, "nm^-1");
  // d = 2π / (2π nm^-1) = 1 nm
  const d = convertFromQtoD(q);
  expect(d.toNumber("nm")).toBeCloseTo(1);
});

test("convertFromQtoD is its own inverse (d→q→d)", () => {
  const q = unit(4, "nm^-1");
  const d = convertFromQtoD(q);
  const q2 = convertFromQtoD(d);
  expect(q2.toNumber("nm^-1")).toBeCloseTo(4);
});

test("larger q gives smaller d", () => {
  const q1 = unit(1, "nm^-1");
  const q2 = unit(2, "nm^-1");
  expect(convertFromQtoD(q2).toNumber("nm")).toBeLessThan(
    convertFromQtoD(q1).toNumber("nm"),
  );
});
