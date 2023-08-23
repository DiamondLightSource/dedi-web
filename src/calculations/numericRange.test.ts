import { expect, test } from "vitest";
import NumericRange from "./numericRange";

test("test numeric range contains value ", () => {
  const range1 = new NumericRange(1, 4);
  expect(range1.containsValue(2));
});

test("test numeric range contains range", () => {
  const range1 = new NumericRange(1, 4);
  const range2 = new NumericRange(2, 3);
  expect(range1.containsRange(range2));

  const range3 = new NumericRange(6, 9);
  expect(range1.containsRange(range3)).toBe(false);
});

test("test numeric range interset", () => {
  const range1 = new NumericRange(1, 4);
  const range2 = new NumericRange(2, 8);
  const intersection = new NumericRange(2, 4);
  expect(range1.intersect(range2)?.equals(intersection));

  const range3 = new NumericRange(20, 28);
  expect(range1.intersect(range3)).toBe(null);
});
