import { RGBColor } from "react-color";
import { Vector3 } from "three";
import NumericRange from "../calculations/numericRange";

// Re think in future
export const getDomain = (
  detector: PlotRectangle,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  const maxAxis = Math.max(detector.upperBound.x, detector.upperBound.y);
  const minAxis = Math.min(detector.lowerBound.x, detector.lowerBound.y);
  const offset = 0.2 * (maxAxis - minAxis);
  const range = new NumericRange(
    Math.round(minAxis - offset),
    Math.round(maxAxis + offset),
  );
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
