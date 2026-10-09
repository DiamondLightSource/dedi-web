import { expect, test } from "vitest";
import { unit } from "mathjs";
import { UnitVector } from "./unitVector";

test("divideByScalar divides both components and keeps their units", () => {
  const v = new UnitVector(unit(6, "mm"), unit(9, "m")).divideByScalar(3);
  expect(v.x.toNumber("mm")).toBeCloseTo(2);
  expect(v.y.toNumber("m")).toBeCloseTo(3);
});
