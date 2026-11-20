import { expect, test } from "vitest";
import { unit } from "mathjs";
import { lengthToPixels, pixelPosition, pixelsToLength } from "./pixels";
import { createInternalDetector } from "../presets/presetManager";

test("pixelsToLength multiplies a pixel count by the pixel size", () => {
  expect(pixelsToLength(10, unit(0.172, "mm")).toNumber("mm")).toBeCloseTo(
    1.72,
  );
});

test("pixelsToLength gives NaN for a missing pixel count", () => {
  expect(pixelsToLength(null, unit(0.172, "mm")).toNumber("mm")).toBeNaN();
  expect(pixelsToLength(undefined, unit(0.172, "mm")).toNumber("mm")).toBeNaN();
});

test("lengthToPixels is the inverse of pixelsToLength", () => {
  const size = unit(0.075, "mm");
  expect(lengthToPixels(pixelsToLength(321, size), size)).toBeCloseTo(321);
});

test("pixelPosition uses the pixel width for x and the pixel height for y", () => {
  const detector = createInternalDetector({
    resolution: { width: 1000, height: 500 },
    pixelSize: { width: 0.1, height: 0.2 },
  });
  const p = pixelPosition({ x: 10, y: 10 }, detector);
  expect(p.x.toNumber("mm")).toBeCloseTo(1);
  expect(p.y.toNumber("mm")).toBeCloseTo(2);
});
