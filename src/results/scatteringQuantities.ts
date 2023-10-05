import { AngleUnits, WavelengthUnits, ReciprocalWavelengthUnits } from "../utils/units";

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
            return quantity / 10;
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === ReciprocalWavelengthUnits.angstroms) {
            return quantity * 10;
        }
        return quantity
    }
}

export class S implements ScatteringQuantity {
    units: ReciprocalWavelengthUnits;
    constructor(units: ReciprocalWavelengthUnits) {
        this.units = units
    }
    fromQ(quantity: number): number {
        if (this.units === ReciprocalWavelengthUnits.angstroms) {
            return (1 / quantity) * 10;
        }
        return 1 / quantity
    }
    tooQ(quantity: number): number {
        if (this.units === ReciprocalWavelengthUnits.angstroms) {
            return 1 / (quantity / 10);
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
            return 2 * Math.PI / (quantity) * 10;
        }
        return 2 * Math.PI / (quantity)
    }
    tooQ(quantity: number): number {
        if (this.units === WavelengthUnits.nanmometres) {
            return 2 * Math.PI / (quantity / 10);
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
            return (2 * Math.asin((quantity * this.wavelength) / (4 * Math.PI)));
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === AngleUnits.degrees) {
            return quantity;
        }
        return 4 * Math.PI * Math.sin(quantity) / this.wavelength
    }
}