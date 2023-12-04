import * as math from "mathjs";

export const CSPEED = math.unit(299792458, "m/s");
export const PLANCK = math.unit(6.62607015e-34, "J s");


export enum DistanceUnits {
  millimetre = "mm",
  micrometre = "um",
}

export enum EnergyUnits {
  electronVolts = "eV",
  kiloElectronVolts = "keV",
}

export enum WavelengthUnits {
  nanmometres = "nm",
  angstroms = "angstrom",
}

export enum ReciprocalWavelengthUnits {
  nanmometres = "nm^-1",
  angstroms = `angstrom^-1`,
}

export enum AngleUnits {
  radians = "rad",
  degrees = "deg",
}

/**
 * An interface to keep track of all units in the app
 */
export interface UnitConfig {
  pixelSizeUnits: DistanceUnits;
  beamEnergyUnits: EnergyUnits;
  beamstopDiameterUnits: DistanceUnits;
  cameraDiameterUnits: DistanceUnits;
  wavelengthUnits: WavelengthUnits;
  angleUnits: AngleUnits;
}

/**
 * Converts energy in kilo elctronvolts to wavelength in nm
 * @param energy energy in keV
 * @returns - wavelength in nm
 */
export const energy2WavelengthConverter = (energy: math.Unit): math.Unit => {
  const result = math.divide(math.multiply(PLANCK, CSPEED), energy.toSI());
  if (typeof result == "number") {
    throw TypeError("units for constants h and c are wrong");
  }
  return result;
};

/**
 * Converts wavelength in nm to energy in kilo elctronvolts
 * @param wavelength in nm
 * @returns energy in keV
 */
export const wavelength2EnergyConverter = (
  wavelength: math.Unit,
): math.Unit => {
  const result = math.divide(math.multiply(PLANCK, CSPEED), wavelength.toSI());
  if (typeof result == "number") {
    throw TypeError("units for constants h and c are wrong");
  }
  return result;
};

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
 * Enforces given range limits
 * @param value input values
 * @param min min value of the range
 * @param max max value for the range
 * @returns
 */
export const enforceRangeLimits = (
  min: number,
  max: number,
  value: number,
): number => {
  if (value > max) {
    return max;
  }
  if (value < min) return min;
  return value;
};
