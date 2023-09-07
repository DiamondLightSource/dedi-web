import { CircularDevice, Detector } from "../utils/types";
import NumericRange from "../calculations/numericRange";

const offset = 100;

// Questionable is this how you would do this think about it a little more
export const getDomains = (
  detector: Detector,
  cameraTube: CircularDevice,
): { xAxis: NumericRange; yAxis: NumericRange } => {
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
