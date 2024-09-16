import { RGBColor } from "react-color";
import { Vector3 } from "three";
import NumericRange from "../calculations/numericRange";

// Re think in future
export const getDomains = (
  detector: PlotRectangle,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  const maxAxis = Math.max(detector.upperBound.x, detector.upperBound.y);
  const minAxis = Math.min(detector.lowerBound.x, detector.lowerBound.y);
  const offset = 0.2 * (maxAxis - minAxis);
  const min = Math.round(minAxis - offset);
  const max = Math.round(maxAxis + offset);
  const range = new NumericRange(min, max);
  return { xAxis: range, yAxis: range };
};

export const color2String = (color: RGBColor) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};

export interface PlotEllipse {
  centre: Vector3;
  endPointX: Vector3;
  endPointY: Vector3;
}

export interface UnitVector {
  x: math.Unit;
  y: math.Unit;
}

export interface PlotRectangle {
  upperBound: Vector3;
  lowerBound: Vector3;
}

export interface PlotRange {
  start: Vector3;
  end: Vector3;
}
