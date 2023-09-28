import { AngleUnits, ReciprocalWavelengthUnits, WavelengthUnits } from "../utils/units";

const theta = "\u03B8";

export type ScatteringUnits = WavelengthUnits | AngleUnits | ReciprocalWavelengthUnits;

export interface ScatteringQuantity {
    name: string,
    units: ScatteringUnits,
    fromQ: (quantity: number, units: ScatteringUnits) => number,
    tooQ: (quantity: number, units: ScatteringUnits) => number,
};

export const quantityQ = {
    name: "q",
    units: ReciprocalWavelengthUnits.nanmometres,
    fromQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity / 10;
        }
        return quantity
    },
    tooQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity * 10;
        }
        return quantity
    },
}

export const quantityS = {
    name: "s",
    units: ReciprocalWavelengthUnits.nanmometres,
    fromQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity / 10;
        }
        return quantity
    },
    tooQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity * 10;
        }
        return quantity
    },
}

export const quantityD = {
    name: "d",
    units: ReciprocalWavelengthUnits.nanmometres,
    fromQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity / 10;
        }
        return quantity
    },
    tooQ: (quantity: number, units: ScatteringUnits) => {
        if (units === ReciprocalWavelengthUnits.angstroms) {
            return quantity * 10;
        }
        return quantity
    },
}

export const quantity2Theta = {
    name: `2${theta}`,
    units: AngleUnits.radians,
    fromQ: (quantity: number, units: ScatteringUnits) => {
        if (units === WavelengthUnits.angstroms) {
            return quantity / 10;
        }
        return quantity
    },
    tooQ: (quantity: number, units: ScatteringUnits) => {
        if (units === WavelengthUnits.angstroms) {
            return quantity * 10;
        }
        return quantity
    },
}