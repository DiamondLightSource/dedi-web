import { expect, test } from "vitest";
import { Ray } from "./ray";
import { Vector2 } from "three";

test("Getting a point from a ray", () => {
  const ray1 = new Ray(new Vector2(1, 1), new Vector2(1, 1));
  const vector_1 = ray1.getPoint(5);
  const vector_2 = new Vector2(6, 6);
  expect(vector_1.equals(vector_2));
});
