import { expect, test } from "vitest";
import {
  angstroms2Nanometres,
  electronVots2KiloElectronVolts,
  energy2WavelengthConverter,
  kiloElectronVolts2ElectronVots,
  micrometre2Milimetre,
  millimetre2Micrometre,
  nanometres2Angstroms,
  wavelength2EnergyConverter,
} from "./units";

const FLOAT_THRESHOLD = 1e-12;

test("Test energy and wavelength converters", () => {
  const wavelengthNM = 0.09;
  const energyKEV = wavelength2EnergyConverter(wavelengthNM);
  expect(Math.abs(energyKEV - 13.777540970654243)).toBeLessThan(
    FLOAT_THRESHOLD,
  );
  const wavelengthOut = energy2WavelengthConverter(energyKEV);
  expect(Math.abs(wavelengthOut - 0.09)).toBeLessThan(FLOAT_THRESHOLD);
});

test("Misc unit coverters", () => {
  expect(Math.abs(kiloElectronVolts2ElectronVots(1)) - 1000).toBeLessThan(
    FLOAT_THRESHOLD,
  );
  expect(Math.abs(electronVots2KiloElectronVolts(1000)) - 1).toBeLessThan(
    FLOAT_THRESHOLD,
  );
  expect(Math.abs(nanometres2Angstroms(1)) - 10).toBeLessThan(FLOAT_THRESHOLD);
  expect(Math.abs(angstroms2Nanometres(10)) - 1).toBeLessThan(FLOAT_THRESHOLD);
  expect(Math.abs(millimetre2Micrometre(1)) - 1000).toBeLessThan(
    FLOAT_THRESHOLD,
  );
  expect(Math.abs(micrometre2Milimetre(1000)) - 1).toBeLessThan(
    FLOAT_THRESHOLD,
  );
});
