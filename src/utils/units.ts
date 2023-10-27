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
 * @returns wave length in nm
 */
export const energy2WavelengthConverter = (energy: number): number => {
  return metres2nanometres((PLANCK * CSPEED) / (kiloElectronVolt2Joule(energy)));
};

/**
 * Converts wavelength in nm to energy in kilo elctronvolts
 * @param wavelength in nm
 * @returns energy in keV
 */
export const wavelength2EnergyConverter = (wavelength: number): number => {
  return joule2KiloElectronVolt((PLANCK * CSPEED) / (nanometres2metres(wavelength))) ;
};

export const joule2KiloElectronVolt = (input: number): number => {
  return input/ 1.602e-16
}

export const kiloElectronVolt2Joule = (input: number): number => {
  return input* 1.602e-16
}

const metres2nanometres = (input: number): number => {
  return input *1e9;
}

const nanometres2metres = (input: number): number => {
  return input *1e-9;
}

export const millimetre2Micrometre = (input: number): number => {
  return 1000 * input;
};

export const micrometre2Milimetre = (input: number): number => {
  return input / 1000;
};

export const nanometres2Angstroms = (input: number): number => {
  return input * 10;
};

export const angstroms2Nanometres = (input: number): number => {
  return input / 10;
};

export const kiloElectronVolts2ElectronVots = (input: number): number => {
  return input * 1000;
};

export const electronVots2KiloElectronVolts = (input: number): number => {
  return input / 1000;
};