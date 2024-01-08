import { expect, test } from "vitest";
import NumericRange from "./numericRange";

test("test numeric range contains number", () => {
  const range1 = new NumericRange(1, 4);
  expect(range1.containsValue(2));

  const range2 = new NumericRange(100, 4);
  expect(range2.min).toEqual(4);
  expect(range2.max).toEqual(100);
});

test("test numeric range contains another", () => {
  const range1 = new NumericRange(1, 4);
  const range2 = new NumericRange(2, 3);
  expect(range1.containsRange(range2));

  const range3 = new NumericRange(6, 9);
  expect(range1.containsRange(range3)).toBe(false);
});

test("test numeric range intersetion", () => {
  const range1 = new NumericRange(1, 4);
  const range2 = new NumericRange(2, 8);
  const intersection = new NumericRange(2, 4);
  expect(range1.intersect(range2)?.equals(intersection));

  const range3 = new NumericRange(20, 28);
  expect(range3.intersect(range2)).toBe(null);
})

test("test numeric range equality", () => {
  const range1 = new NumericRange(2, 3);
  const range2 = new NumericRange(2, 3);
  expect(range1.equals(range2));
});

test("test numeric range apply", () => {
  const range1 = new NumericRange(2, 3);
  const range2 = new NumericRange(4, 6);
  const range3 = range1.apply((input: number) => { return 2 * input });
  expect(!range1.equals(range3));
  expect(range3.equals(range2));

  const range4 = new NumericRange(12, 18);
  range1.applyInPlace((input: number) => { return 3 * input }).applyInPlace((input: number) => { return 2 * input });
  expect(range4.equals(range1));
})
