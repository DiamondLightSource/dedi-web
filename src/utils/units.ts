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

export const millimetre2Micrometre = (input: number):number =>{
  return 1000*input
}

export const micrometre2Milimetre = (input: number):number => {
  return input/1000
}

export const nanometres2Angstroms = (input: number):number => {
  return input*10
}

export const angstroms2Nanometres = (input:number): number=>{
  return input/10
}

export const kiloElectronVolts2ElectronVots = (input: number): number =>{
  return input*1000
}

export const electronVots2KiloElectronVolts = (input: number): number =>{
  return input/1000
}
