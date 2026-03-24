import { RGBColor } from "react-color";
import { Vector3 } from "three";
import NumericRange from "../calculations/numericRange";

const PADDING = 0.1;

function boundingBox(points: Vector3[]): {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
} {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    xMin: Math.min(...xs),
    xMax: Math.max(...xs),
    yMin: Math.min(...ys),
    yMax: Math.max(...ys),
  };
}

/**
 * Computes the plot domain with two tiers of points:
 *
 * - `required` points (detector corners, beamstop endpoints) are always fully
 *   in view with 10% padding. These anchor the camera.
 * - `optional` points (range lines, clearance) are included only when they
 *   would not expand either axis beyond `maxExpansion` times the required
 *   extent. This prevents a far-reaching range line from shrinking the
 *   detector to a tiny sliver.
 *
 * No integer rounding is applied — the function is unit-agnostic and works
 * correctly regardless of whether the transform is mm, pixel or reciprocal.
 */
export const getDomain = (
  required: Vector3[],
  optional: Vector3[],
  maxExpansion = 1.5,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  const { xMin, xMax, yMin, yMax } = boundingBox(required);
  const xPad = PADDING * (xMax - xMin);
  const yPad = PADDING * (yMax - yMin);

  // Baseline domain guaranteed to show all required points.
  let domXMin = xMin - xPad;
  let domXMax = xMax + xPad;
  let domYMin = yMin - yPad;
  let domYMax = yMax + yPad;

  const baseXExtent = domXMax - domXMin;
  const baseYExtent = domYMax - domYMin;

  // Expand to include optional points only within the expansion budget.
  for (const p of optional) {
    const nextXMin = Math.min(domXMin, p.x);
    const nextXMax = Math.max(domXMax, p.x);
    const nextYMin = Math.min(domYMin, p.y);
    const nextYMax = Math.max(domYMax, p.y);

    const xOk = nextXMax - nextXMin <= maxExpansion * baseXExtent;
    const yOk = nextYMax - nextYMin <= maxExpansion * baseYExtent;

    if (xOk) {
      domXMin = nextXMin;
      domXMax = nextXMax;
    }
    if (yOk) {
      domYMin = nextYMin;
      domYMax = nextYMax;
    }
  }

  return {
    xAxis: new NumericRange(domXMin, domXMax),
    yAxis: new NumericRange(domYMin, domYMax),
  };
};

export const color2String = (color: RGBColor) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

export interface PlotEllipse {
  centre: Vector3;
  endPointX: Vector3;
  endPointY: Vector3;
}

export interface PlotRectangle {
  upperBound: Vector3;
  lowerBound: Vector3;
}

export interface PlotRange {
  start: Vector3;
  end: Vector3;
}

export interface PlotCalibrant {
  endPointX: Vector3;
  endPointY: Vector3;
  ringFractions: number[];
}
