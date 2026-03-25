import { expect, test } from "vitest";
import { unit } from "mathjs";
import {
  energy2WavelengthConverter,
  wavelength2EnergyConverter,
  parseNumericInput,
  enforceRangeLimits,
} from "./units";

// --- energy2WavelengthConverter ---
// Known value: 12.4 keV ↔ ~0.1 nm  (hc ≈ 1.2398 eV·μm)

test("energy2WavelengthConverter gives ~0.1 nm for 12.4 keV", () => {
  const energy = unit(12.4, "keV");
  const wavelength = energy2WavelengthConverter(energy);
  expect(wavelength.toNumber("nm")).toBeCloseTo(0.1, 2);
});

test("energy2WavelengthConverter is inverse of wavelength2EnergyConverter", () => {
  const energy = unit(8, "keV");
  const wavelength = energy2WavelengthConverter(energy);
  const recovered = wavelength2EnergyConverter(wavelength);
  expect(recovered.toNumber("keV")).toBeCloseTo(8, 4);
});

// --- wavelength2EnergyConverter ---

test("wavelength2EnergyConverter gives ~12.4 keV for 0.1 nm", () => {
  const wavelength = unit(0.1, "nm");
  const energy = wavelength2EnergyConverter(wavelength);
  expect(energy.toNumber("keV")).toBeCloseTo(12.4, 2);
});

test("wavelength2EnergyConverter is inverse of energy2WavelengthConverter", () => {
  const wavelength = unit(0.15, "nm");
  const energy = wavelength2EnergyConverter(wavelength);
  const recovered = energy2WavelengthConverter(energy);
  expect(recovered.toNumber("nm")).toBeCloseTo(0.15, 4);
});

// shorter wavelength → higher energy
test("shorter wavelength gives higher energy", () => {
  const e1 = wavelength2EnergyConverter(unit(0.2, "nm")).toNumber("keV");
  const e2 = wavelength2EnergyConverter(unit(0.1, "nm")).toNumber("keV");
  expect(e2).toBeGreaterThan(e1);
});

// --- parseNumericInput ---

test("parseNumericInput parses a valid integer string", () => {
  expect(parseNumericInput("42")).toBe(42);
});

test("parseNumericInput parses a valid float string", () => {
  expect(parseNumericInput("3.14")).toBeCloseTo(3.14);
});

test("parseNumericInput trims whitespace before parsing", () => {
  expect(parseNumericInput("  10  ")).toBe(10);
});

test("parseNumericInput returns null for non-numeric input", () => {
  expect(parseNumericInput("abc")).toBeNull();
});

test("parseNumericInput returns null for an empty string", () => {
  expect(parseNumericInput("")).toBeNull();
});

test("parseNumericInput returns 0 for '0'", () => {
  expect(parseNumericInput("0")).toBe(0);
});

// --- enforceRangeLimits ---

test("enforceRangeLimits returns the value when within range", () => {
  expect(enforceRangeLimits(0, 10, 5)).toBe(5);
});

test("enforceRangeLimits clamps to min when value is below range", () => {
  expect(enforceRangeLimits(0, 10, -3)).toBe(0);
});

test("enforceRangeLimits clamps to max when value is above range", () => {
  expect(enforceRangeLimits(0, 10, 15)).toBe(10);
});

test("enforceRangeLimits returns min when value equals min", () => {
  expect(enforceRangeLimits(2, 8, 2)).toBe(2);
});

test("enforceRangeLimits returns max when value equals max", () => {
  expect(enforceRangeLimits(2, 8, 8)).toBe(8);
});
