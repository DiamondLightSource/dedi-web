import { expect, test } from "vitest";
import { Ray } from "./ray";
import { Vector2 } from "three";

// --- constructor ---

test("constructor throws when direction is the zero vector", () => {
  expect(() => new Ray(new Vector2(0, 0), new Vector2(1, 2))).toThrow();
});

// --- getPoint ---

test("getPoint returns the initial point at t=0", () => {
  const ray = new Ray(new Vector2(1, 2), new Vector2(3, 4));
  const p = ray.getPoint(0);
  expect(p.x).toBeCloseTo(3);
  expect(p.y).toBeCloseTo(4);
});

test("getPoint returns initial + t * direction", () => {
  // direction=(1,0), initial=(2,3), t=5 → (7, 3)
  const ray = new Ray(new Vector2(1, 0), new Vector2(2, 3));
  const p = ray.getPoint(5);
  expect(p.x).toBeCloseTo(7);
  expect(p.y).toBeCloseTo(3);
});

// --- getPointAtDistance ---

test("getPointAtDistance returns the point the given Euclidean distance from the initial point", () => {
  // direction=(3,4) has length 5; distance=10 → t=2 → point=(6, 8)
  const ray = new Ray(new Vector2(3, 4), new Vector2(0, 0));
  const p = ray.getPointAtDistance(10);
  expect(p.x).toBeCloseTo(6);
  expect(p.y).toBeCloseTo(8);
});

// --- getParameterRange ---

test("getParameterRange sorts t1 and t2", () => {
  const r = Ray.getParameterRange(7, 3);
  expect(r.min).toBe(3);
  expect(r.max).toBe(7);
});

test("getParameterRange clamps negative tMin to 0", () => {
  const r = Ray.getParameterRange(-5, 8);
  expect(r.min).toBe(0);
  expect(r.max).toBe(8);
});

test("getParameterRange leaves already-valid positive range unchanged", () => {
  const r = Ray.getParameterRange(3, 7);
  expect(r.min).toBe(3);
  expect(r.max).toBe(7);
});

// --- getCircleIntersectionRange ---

test("getCircleIntersectionRange returns correct t-range when ray passes through circle", () => {
  // Ray along +x from origin, circle at (5,0) radius 3
  // Intersections at x=2 (t=2) and x=8 (t=8)
  const ray = new Ray(new Vector2(1, 0), new Vector2(0, 0));
  const result = ray.getCircleIntersectionRange(3, new Vector2(5, 0));
  expect(result?.min).toBeCloseTo(2);
  expect(result?.max).toBeCloseTo(8);
});

test("getCircleIntersectionRange returns null when ray misses circle", () => {
  // Ray along +x from origin, circle at (5,5) radius 1 — too far above the ray
  const ray = new Ray(new Vector2(1, 0), new Vector2(0, 0));
  expect(ray.getCircleIntersectionRange(1, new Vector2(5, 5))).toBeNull();
});

// --- getRectangleIntersectionRange ---

test("getRectangleIntersectionRange returns correct t-range for a horizontal ray through the rectangle", () => {
  // Ray: initial=(0,1), direction=(1,0)
  // Rect: topLeft=(2,3), dimensions=(4,6) → x:[2,6], y:[-3,3]
  // x-intersections t=2 and t=6; y=1 is inside [-3,3]
  const ray = new Ray(new Vector2(1, 0), new Vector2(0, 1));
  const result = ray.getRectangleIntersectionRange(
    new Vector2(2, 3),
    new Vector2(4, 6),
  );
  expect(result?.min).toBeCloseTo(2);
  expect(result?.max).toBeCloseTo(6);
});

test("getRectangleIntersectionRange returns correct t-range for a diagonal ray", () => {
  // Ray: initial=(0,0), direction=(1,1)
  // Rect: topLeft=(2,5), dimensions=(4,4) → x:[2,6], y:[1,5]
  // x: t in [2,6]  y: t in [1,5]  intersection: [2,5]
  const ray = new Ray(new Vector2(1, 1), new Vector2(0, 0));
  const result = ray.getRectangleIntersectionRange(
    new Vector2(2, 5),
    new Vector2(4, 4),
  );
  expect(result?.min).toBeCloseTo(2);
  expect(result?.max).toBeCloseTo(5);
});

test("getRectangleIntersectionRange returns null when horizontal ray is above the rectangle", () => {
  // Ray: initial=(0,5), direction=(1,0); rect y range is [-3,3]
  const ray = new Ray(new Vector2(1, 0), new Vector2(0, 5));
  const result = ray.getRectangleIntersectionRange(
    new Vector2(2, 3),
    new Vector2(4, 6),
  );
  expect(result).toBeNull();
});

test("getRectangleIntersectionRange returns null when vertical ray is beside the rectangle", () => {
  // Ray: initial=(10,0), direction=(0,1); rect x range is [2,6]
  const ray = new Ray(new Vector2(0, 1), new Vector2(10, 0));
  const result = ray.getRectangleIntersectionRange(
    new Vector2(2, 3),
    new Vector2(4, 6),
  );
  expect(result).toBeNull();
});

