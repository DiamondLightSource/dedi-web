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

// unit converters to keep logic in one place
export const energy2WavelengthConverter = (energy: number): number => {
  return (PLANCK *CSPEED)/energy;
};

export const wavelength2EnergyConverter = (wavelength: number): number => {
  return (PLANCK *CSPEED)/ wavelength;
};
