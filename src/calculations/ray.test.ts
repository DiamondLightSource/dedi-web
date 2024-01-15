import { expect, test } from "vitest";
import { Ray } from "./ray";
import { Vector2 } from "three";

test("test getting a point from a ray", () => {
  const ray1 = new Ray(new Vector2(1, 1), new Vector2(1, 1));
  const vector_1 = ray1.getPoint(5);
  const vector_2 = new Vector2(6, 6);
  expect(vector_1.equals(vector_2));
});

test("test parameter range", () => {
  const output1 = Ray.getParameterRange(-64, 34);
  expect(output1.max === 34);
  expect(output1.min === 0);
  const output2 = Ray.getParameterRange(90, 14);
  expect(output1.min === 14);
  expect(output2.max === 90);
});
