import { type MathType, Unit, divide, isUnit, multiply, unit } from "mathjs";

// Useful constants
export const CSPEED = unit(299792458, "m/s");
export const PLANCK = unit(6.62607015e-34, "J s");

// Refer to https://mathjs.org/docs/datatypes/units.html for unit strings

export const AngstromSymbol = "\u212B";
export const MuSymbol = "\u03bc";

/**
 * An Enum of the Length Units that the app supports
 */
export enum LengthUnits {
  millimetre = "mm",
  micrometre = "um",
  metre = "m",
}

/**
 * An Enum of the Energy Units That the app supports
 */
export enum EnergyUnits {
  electronVolts = "eV",
  kiloElectronVolts = "keV",
}

/**
 * An Enum of the Wavelength Units that the app supports
 */
export enum WavelengthUnits {
  nanometres = "nm",
  angstroms = "angstrom",
}

/**
 *
 */
export enum ReciprocalWavelengthUnits {
  nanometres = "nm^-1",
  angstroms = `angstrom^-1`,
}

export enum AngleUnits {
  radians = "rad",
  degrees = "deg",
}

/**
 * Narrows a mathjs arithmetic result back to a Unit.
 *
 * mathjs types several Unit operations (e.g. Unit × number, number ÷ Unit,
 * Unit ÷ Unit) as returning the broad MathType, even when the result is
 * always a Unit for our inputs.
 * @param value result of a mathjs operation
 * @param context name of the caller, included in the error message
 * @returns the value as a Unit
 */
export function asUnit(value: MathType, context: string): Unit {
  if (!isUnit(value)) {
    throw new TypeError(`${context}: expected a Unit result`);
  }
  return value;
}

/**
 * Converts energy in kilo electronvolts to wavelength in nm
 * @param energy energy in keV
 * @returns wavelength in nm
 */
export const energy2WavelengthConverter = (energy: Unit): Unit =>
  asUnit(
    divide(multiply(PLANCK, CSPEED), energy.toSI()),
    "energy2WavelengthConverter",
  );

/**
 * Converts wavelength in nm to energy in kilo elctronvolts
 * @param wavelength in nm
 * @returns energy in keV
 */
export const wavelength2EnergyConverter = (wavelength: Unit): Unit =>
  asUnit(
    divide(multiply(PLANCK, CSPEED), wavelength.toSI()),
    "wavelength2EnergyConverter",
  );

// Could be dead code
/**
 * A function to process numeric texbox inputs in a consistant way.
 * @param input input string from the texbox
 * @returns a valid float or null
 */
export const parseNumericInput = (input: string): number | null => {
  const output = parseFloat(input.trim());

  if (!output && output != 0) {
    return null;
  }
  return output;
};

/**
 * Enforces as range by setting any ( < min ) to min and ( > max ) to max
 * @param min min value of the range
 * @param max max value for the range
 * @param value input values
 * @returns
 */
export const enforceRangeLimits = (
  min: number,
  max: number,
  value: number,
): number => {
  if (value > max) return max;
  if (value < min) return min;
  return value;
};

/**
 * Add timestamp to log message
 * @param message
 * @returns
 */
export function formatLogMessage(message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}]: ${message}`;
}
