import { expect, test } from "vitest";
import UnitRange from "./unitRange";
import * as mathjs from "mathjs";

test("test unit range contains unit", () => {
    expect(() => { new UnitRange(mathjs.unit(6, "deg"), mathjs.unit(9, "m")) }).toThrowError();
    const range1 = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(4, "m"));
    expect(range1.containsValue(mathjs.unit(3, "m")));


    const range2 = new UnitRange(mathjs.unit(100, "m"), mathjs.unit(4, "m"));
    expect(range2.min).toEqual(mathjs.unit(4, "m"));
    expect(range2.max).toEqual(mathjs.unit(100, "m"));
});

test("test unit range contains another range", () => {
    const range1 = new UnitRange(mathjs.unit(1, "nm"), mathjs.unit(4, "m"));
    const range2 = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(3, "km"));
    expect(range1.containsRange(range2));

    const range3 = new UnitRange(mathjs.unit(6, "m"), mathjs.unit(9, "m"));
    expect(range1.containsRange(range3)).toBe(false);

});

test("test unit range intersection", () => {
    const range1 = new UnitRange(mathjs.unit(1, "nm"), mathjs.unit(4, "m"));
    const range2 = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(8, "m"));
    const intersection = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(4, "m"));
    expect(range1.intersect(range2)?.equals(intersection));

    const range3 = new UnitRange(mathjs.unit(20, "m"), mathjs.unit(28, "m"));
    expect(range3.intersect(range2)).toBe(null);
});

test("test unit range equality", () => {
    const range1 = new UnitRange(mathjs.unit(1, "nm"), mathjs.unit(4, "m"));
    const range2 = new UnitRange(mathjs.unit(1, "nm"), mathjs.unit(4, "m"));
    expect(range1.equals(range2));
});

test("test unit range apply", () => {
    const range1 = new UnitRange(mathjs.unit(2, "m"), mathjs.unit(3, "m"));
    const range2 = new UnitRange(mathjs.unit(4, "m^2"), mathjs.unit(6, "m^2"));
    const range3 = range1.apply((input: mathjs.Unit) => { return input.multiply(mathjs.unit(2, "m")) });
    expect(range3.equals(range2));

    const range4 = new UnitRange(mathjs.unit(12, "m^4"), mathjs.unit(18, "m^4"));
    range1.applyInPlace((input: mathjs.Unit) => { return input.multiply(mathjs.unit(3, "m")) }).applyInPlace((input: mathjs.Unit) => { return input.multiply(mathjs.unit(2, "m^2")) });
    expect(range4.equals(range1));
})