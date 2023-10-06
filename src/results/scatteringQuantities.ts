import { AngleUnits, WavelengthUnits, ReciprocalWavelengthUnits, nanometres2Angstroms, angstroms2Nanometres } from "../utils/units";
import { MathUtils } from "three/src/Three.js";

export interface ScatteringQuantity {
    units: WavelengthUnits | AngleUnits | ReciprocalWavelengthUnits,
    fromQ: (quantity: number) => number,
    tooQ: (quantity: number) => number,
}

export class Q implements ScatteringQuantity {
    units: ReciprocalWavelengthUnits;
    constructor(units: ReciprocalWavelengthUnits) {
        this.units = units
    }
    fromQ(quantity: number): number {
        if (this.units == ReciprocalWavelengthUnits.angstroms) {
            // reciprocal units so we do the inverse
            return angstroms2Nanometres(quantity);
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === ReciprocalWavelengthUnits.angstroms) {
            // reciprocal units so we do the inverse
            return nanometres2Angstroms(quantity);
        }
        return quantity
    }
}

export class S implements ScatteringQuantity {
    units: WavelengthUnits;
    constructor(units: WavelengthUnits) {
        this.units = units
    }
    fromQ(quantity: number): number {
        if (this.units === WavelengthUnits.angstroms) {

            return nanometres2Angstroms(1 / quantity);
        }
        return 1 / quantity
    }
    tooQ(quantity: number): number {
        if (this.units === WavelengthUnits.angstroms) {
            return 1 / (angstroms2Nanometres(quantity));
        }
        return 1 / quantity
    }
}

export class D implements ScatteringQuantity {
    units: WavelengthUnits;
    constructor(units: WavelengthUnits) {
        this.units = units;
    }
    fromQ(quantity: number): number {
        if (this.units === WavelengthUnits.angstroms) {
            return nanometres2Angstroms(2 * Math.PI / quantity);
        }
        return 2 * Math.PI / (quantity)
    }
    tooQ(quantity: number): number {
        if (this.units === WavelengthUnits.angstroms) {
            return 2 * Math.PI / angstroms2Nanometres(quantity);
        }
        return 2 * Math.PI / (quantity)
    }
}

export class TwoTheta implements ScatteringQuantity {
    units: AngleUnits;
    wavelength: number;
    constructor(units: AngleUnits, wavelength: number) {
        this.units = units
        this.wavelength = wavelength
    }
    fromQ(quantity: number): number {
        if (this.units === AngleUnits.degrees) {
            return 2 * MathUtils.radToDeg(Math.asin((quantity * this.wavelength) / (4 * Math.PI)));
        }
        return 2 * Math.asin((quantity * this.wavelength) / (4 * Math.PI))
    }
    tooQ(quantity: number): number {
        if (this.units === AngleUnits.degrees) {
            return ((4 * Math.PI) / this.wavelength) * Math.sin(MathUtils.degToRad(quantity / 2));
        }
        return ((4 * Math.PI) / this.wavelength) * Math.sin(quantity / 2)
    }
}