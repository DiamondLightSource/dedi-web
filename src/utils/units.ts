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
  clearanceDiameterUnits: DistanceUnits;
  cameraDiameterUnits: DistanceUnits;
  wavelengthUnits: WavelengthUnits;
  angleUnits: AngleUnits;
}
