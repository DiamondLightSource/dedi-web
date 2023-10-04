
const angstrum = "\u212B";

// export type WavelengthUnits = "nanometres" | "angstroms";
// export const WavelengthUnitsOptions = [
//     { value: "nanometres", label: "nm" },
//     { value: "angstroms", label: angstrum },
// ];

// export type ReciprocalWavelengthUnits = "r-nanometres" | "r-angstroms"
// export const ReciprocalWavelengthUnitsOptions = [
//     { value: "r-nanometres", label: "1/nm" },
//     { value: "r-angstroms", label: `1/${angstrum}` }];

// export type AngleUnits = "radians" | "degrees";
// export const AngleUnitsOptions = [
//     { value: "radians", label: "rad" },
//     { value: "degrees", label: "deg" },
// ];

math.unit


export class Q implements ScatteringQuantity {
    units: ReciprocalWavelengthUnits;
    unitOptions: Array<{ value: string, label: string }>;
    constructor(units: ReciprocalWavelengthUnits, unitOptions: Array<{ value: string, label: string }>) {
        this.units = units
        this.unitOptions = unitOptions
    }
    fromQ(quantity: number): number {
        if (this.units == "r-angstroms") {
            return quantity / 10;
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === "r-angstroms") {
            return quantity * 10;
        }
        return quantity
    }
}

export class S implements ScatteringQuantity {
    units: ReciprocalWavelengthUnits;
    unitOptions: Array<{ value: string, label: string }>;
    constructor(units: ReciprocalWavelengthUnits, unitOptions: Array<{ value: string, label: string }>) {
        this.units = units
        this.unitOptions = unitOptions
    }
    fromQ(quantity: number): number {
        if (this.units === "r-angstroms") {
            return (1 / quantity) * 10;
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === "r-angstroms") {
            return 1 / (quantity / 10);
        }
        return quantity
    }
}

export class D implements ScatteringQuantity {
    units: WavelengthUnits;
    unitOptions: Array<{ value: string, label: string }>;
    constructor(units: WavelengthUnits, unitOptions: Array<{ value: string, label: string }>) {
        this.units = units;
        this.unitOptions = unitOptions
    }
    fromQ(quantity: number): number {
        if (this.units === "angstroms") {
            return 2 * Math.PI / (quantity) * 10;
        }
        return 2 * Math.PI / (quantity)
    }
    tooQ(quantity: number): number {
        if (this.units === "angstroms") {
            return 2 * Math.PI / (quantity / 10);
        }
        return 2 * Math.PI / (quantity)
    }
}

export class TwoTheta implements ScatteringQuantity {
    units: AngleUnits;
    wavelength: number;
    unitOptions: Array<{ value: string, label: string }>;
    constructor(units: AngleUnits, wavelength: number, unitOptions: Array<{ value: string, label: string }>) {
        this.units = units
        this.wavelength = wavelength
        this.unitOptions = unitOptions
    }
    fromQ(quantity: number): number {
        if (this.units === "degrees") {
            return (2 * Math.asin((quantity * this.wavelength) / (4 * Math.PI)));
        }
        return quantity
    }
    tooQ(quantity: number): number {
        if (this.units === "degrees") {
            return quantity;
        }
        return 4 * Math.PI * Math.sin(quantity) / this.wavelength
    }
}
