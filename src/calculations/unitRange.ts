import * as mathjs from "mathjs";
import NumericRange from "./numericRange";

export default class UnitRange {
    min: mathjs.Unit;
    max: mathjs.Unit;

    constructor(min: mathjs.Unit, max: mathjs.Unit) {
        this.min = min;
        this.max = max;

        if (mathjs.larger(min, max)) {
            const temp = max.clone();
            this.max = min;
            this.min = temp;
        }
    }

    to(units: string): UnitRange {
        return new UnitRange(this.min.to(units), this.max.to(units))
    }

    containsValue(value: mathjs.Unit): boolean {
        return mathjs.largerEq(value, this.min) && mathjs.largerEq(value, this.max);
    }

    containsRange(other: UnitRange): boolean {
        console.log(`${other.min.formatUnits()} ${this.min.formatUnits()}`)
        console.log(`${other.min.formatUnits()} ${this.min.formatUnits()}`)
        return mathjs.smallerEq(this.min, other.min) && mathjs.largerEq(this.max, other.max,);
    }

    toString(): string {
        return `(min:${this.min.toString()}, max:${this.max.toString()})`;
    }


    intersect(other: UnitRange): UnitRange | null {
        if (mathjs.larger(other.min, this.max) || mathjs.larger(this.min, other.max)) return null;

        return new UnitRange(
            mathjs.max(other.min, this.min),
            mathjs.min(other.max, this.max),
        );
    }

    equals(other: UnitRange): boolean {
        return mathjs.equal(this.min, other.min) && mathjs.equal(this.max, other.max);
    }


    apply(func: (value: mathjs.Unit) => mathjs.Unit): UnitRange {
        return new UnitRange(func(this.min), func(this.max));
    }

    inPlaceApply(func: (value: mathjs.Unit) => mathjs.Unit): UnitRange {
        this.min = func(this.min);
        this.max = func(this.max);
        return this;
    }

    static fromNumericRange(range: NumericRange | null, units: string): UnitRange {
        return new UnitRange(
            mathjs.unit(range?.min ?? NaN, units),
            mathjs.unit(range?.max ?? NaN, units),
        )
    }
}
