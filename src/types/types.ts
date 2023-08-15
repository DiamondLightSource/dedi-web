

export enum BeamlineConfig {
    SaxAnIso = "I22 SAXS Anisotropic",
    SaxIso = "I22 SAXS Isotripic",
    GiSaxs = "I22 GiSAXS",
    Wax = "I22 WAXS",
    GiWaxs = "I22 GiWAXS"
}

export enum DetectorType {
    pilatusP32M = "Pilatus P3-2M",
    pilatus6m = "Pilatus6m"
    // Add more types
    // It could be an enum may not be right for this data
}


export interface Detector {
    detectorType: DetectorType,
    resolution: { height: number, width: number }
    pixel_size: { height: number, width: number }
}

export interface Position {
    x: number,
    y: number
}

export interface Beamstop {
    diameter: number
    position: Position
}

export interface CameraTube {
    diameter: number
    position: Position
}

