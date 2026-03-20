import { RGBColor } from "react-color";
import { Vector3 } from "three";
import NumericRange from "../calculations/numericRange";

/**
 * Computes the plot domain from a set of points, returning separate x and y
 * ranges with a 20% padding on each axis. Pass all geometrically significant
 * points (detector corners, beamstop endpoints, etc.) to guarantee everything
 * stays within the visible domain.
 */
export const getDomain = (
  ...points: Vector3[]
): { xAxis: NumericRange; yAxis: NumericRange } => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const xPad = 0.2 * (xMax - xMin);
  const yPad = 0.2 * (yMax - yMin);
  return {
    xAxis: new NumericRange(Math.round(xMin - xPad), Math.round(xMax + xPad)),
    yAxis: new NumericRange(Math.round(yMin - yPad), Math.round(yMax + yPad)),
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
