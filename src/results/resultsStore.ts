import { AngleUnits, WavelengthUnits } from "../utils/units";
import QSpace from "../calculations/qspace";
import NumericRange from "../calculations/numericRange";

interface ScatteringQuantity {
    name: string,
    minValue: number,
    maxValue: number,
    RequestedMin: number,
    RequestedMax: number,
}

export interface ResultStore {
    selected: string,
    q: ScatteringQuantity,
    qUnits: WavelengthUnits,
    qspace: QSpace
    twoTheta: ScatteringQuantity
    thetaUnits: AngleUnits
    visableQRange: NumericRange
    fullQRange: NumericRange
}





