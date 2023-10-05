import { create } from "zustand";
import NumericRange from "../calculations/numericRange";
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

export const theta = '\u03B8'

export enum ScatteringOptions {
    q = "q",
    s = "s",
    d = "d",
    twoTheta = `2${theta}`
}



export interface ResultStore {
    requested: ScatteringOptions;
    q: ScatteringQuantity;
    s: ScatteringQuantity;
    d: ScatteringQuantity;
    twoTheta: ScatteringQuantity;
    requestedRange: NumericRange;
    updateRequested: (quantity: ScatteringOptions) => void;
    updateRequestedRange: (newRange: NumericRange) => void;
    updateQUnits: (newunits: ReciprocalWavelengthUnits) => void;
    updateSUnits: (newunits: ReciprocalWavelengthUnits) => void;
    updateDUnits: (newunits: WavelengthUnits) => void;
    updateThetaUnits: (newunits: AngleUnits, wavelength: number) => void;
}

export const useResultStore = create<ResultStore>((set) => ({
    requested: ScatteringOptions.q,
    q: new Q(ReciprocalWavelengthUnits.nanmometres),
    s: new S(ReciprocalWavelengthUnits.nanmometres),
    d: new D(WavelengthUnits.nanmometres),
    twoTheta: new TwoTheta(AngleUnits.radians, 0),
    requestedRange: new NumericRange(0, 1),
    updateRequested: (quantity: ScatteringOptions) => { set({ requested: quantity }) },
    updateRequestedRange: (newRange: NumericRange) => { set({ requestedRange: newRange }) },
    updateQUnits: (newunits: ReciprocalWavelengthUnits) => set({ q: new Q(newunits) }),
    updateSUnits: (newunits: ReciprocalWavelengthUnits) => set({ s: new S(newunits) }),
    updateDUnits: (newunits: WavelengthUnits) => set({ d: new D(newunits) }),
    updateThetaUnits: (newunits: AngleUnits, wavelength: number) => set({ twoTheta: new TwoTheta(newunits, wavelength) })
}));

