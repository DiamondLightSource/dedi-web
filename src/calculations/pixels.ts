import { Unit, unit } from "mathjs";
import { AppDetector, SimpleVector2 } from "../utils/types";
import { UnitVector } from "./unitVector";

/**
 * Converts a pixel count along one detector axis to a physical length.
 * @param pixels number of pixels (null/undefined gives NaN, like an empty input)
 * @param pixelSize size of one pixel along that axis
 * @returns length in metres
 */
export function pixelsToLength(
  pixels: number | null | undefined,
  pixelSize: Unit,
): Unit {
  return unit((pixels ?? NaN) * pixelSize.toNumber("m"), "m");
}

/**
 * Converts a physical length along one detector axis to a pixel count.
 * @param length length along that axis
 * @param pixelSize size of one pixel along that axis
 * @returns (possibly fractional) number of pixels
 */
export function lengthToPixels(length: Unit, pixelSize: Unit): number {
  return length.toNumber("m") / pixelSize.toNumber("m");
}

/**
 * Converts a pixel position on the detector to a physical position, using the
 * pixel width for x and the pixel height for y.
 */
export function pixelPosition(
  point: SimpleVector2,
  detector: AppDetector,
): UnitVector {
  return new UnitVector(
    pixelsToLength(point.x, detector.pixelSize.width),
    pixelsToLength(point.y, detector.pixelSize.height),
  );
}
