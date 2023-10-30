const mu = "\u03bc";
const angstrum = "\u212B";

export enum DistanceUnits {
  millimetre = "mm",
  micrometre = mu + "m",
}

export enum EnergyUnits {
  electronVolts = "eV",
  kiloElectronVolts = "keV",
}

export enum WavelengthUnits {
  nanmometres = "nm",
  angstroms = angstrum,
}

export enum ReciprocalWavelengthUnits {
  nanmometres = "1/nm",
  angstroms = `1/${angstrum}`,
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

export const CSPEED = 299792458;
export const PLANCK = 6.62607015e-34;

/**
 * Converts energy in kilo elctronvolts to wavelength in nm
 * @param energy energy in keV
 * @returns - wavelength in nm
 */
export const energy2WavelengthConverter = (energy: number): number => {
  return metres2nanometres((PLANCK * CSPEED) / kiloElectronVolt2Joule(energy));
};

/**
 * Converts wavelength in nm to energy in kilo elctronvolts
 * @param wavelength in nm
 * @returns energy in keV
 */
export const wavelength2EnergyConverter = (wavelength: number): number => {
  return joule2KiloElectronVolt(
    (PLANCK * CSPEED) / nanometres2metres(wavelength),
  );
};

/**
 * Converts joules to keV
 * @param input value in joules
 * @returns output in keV
 */
export const joule2KiloElectronVolt = (input: number): number => {
  return input / 1.602e-16;
};

/**
 * Converts keV to joules
 * @param input value in keV
 * @returns output in joules
 */
export const kiloElectronVolt2Joule = (input: number): number => {
  return input * 1.602e-16;
};

/**
 * Converts meters into nanometeres
 * @param input value in metres
 * @returns output in nanometeres
 */
const metres2nanometres = (input: number): number => {
  return input * 1e9;
};

/**
 * Converts nanometres to metres
 * @param input value in nanometres
 * @returns output in metres
 */
const nanometres2metres = (input: number): number => {
  return input * 1e-9;
};

/**
 * Converts millimetres to micrometres
 * @param input value in nillimetres
 * @returns output in micrometres
 */
export const millimetre2Micrometre = (input: number): number => {
  return 1000 * input;
};

/**
 * Converts micrometres to millimetres
 * @param input values in micrometres
 * @returns output in millimetres
 */
export const micrometre2Milimetre = (input: number): number => {
  return input / 1000;
};

/**
 * Converts nanometres to Angstroms
 * @param input value in nanometres
 * @returns output in angstroms
 */
export const nanometres2Angstroms = (input: number): number => {
  return input * 10;
};

/**
 * Converts angstrom to nm
 * @param input value in angstrom
 * @returns output in nanometres
 */
export const angstroms2Nanometres = (input: number): number => {
  return input / 10;
};

/**
 * Converts keV to eV
 * @param input value in keV
 * @returns output in eV
 */
export const kiloElectronVolts2ElectronVots = (input: number): number => {
  return input * 1000;
};

/**
 * Converts eV to keV
 * @param input value in eV
 * @returns output in keV
 */
export const electronVots2KiloElectronVolts = (input: number): number => {
  return input / 1000;
};
