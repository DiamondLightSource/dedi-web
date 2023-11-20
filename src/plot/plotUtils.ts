import { CircularDevice, Detector } from "../utils/types";
import NumericRange from "../calculations/numericRange";
import { RGBColor } from "react-color";
import { PlotAxes } from "./plotStore";

// Questionable is this how you would do this think about it a little more
export const getDomains = (
  detector: Detector,
  cameraTube: CircularDevice,
  axes: PlotAxes,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  let offset = 500;
  if (axes === PlotAxes.milimeter) {
    offset = 100;
  }
  const maxLength = Math.max(
    detector.resolution.height,
    detector.resolution.width,
    cameraTube.diameter,
  );
  return {
    xAxis: new NumericRange(-offset, Math.round(maxLength + offset)),
    yAxis: new NumericRange(-offset, Math.round(maxLength + offset)),
  };
};

export const color2String = (color: RGBColor) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};
