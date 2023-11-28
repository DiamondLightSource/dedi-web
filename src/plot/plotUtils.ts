import NumericRange from "../calculations/numericRange";
import { RGBColor } from "react-color";
import { PlotAxes } from "./plotStore";
import { Vector3 } from "three";
import * as mathjs from "mathjs";

// Questionable is this how you would do this think about it a little more
export const getDomains = (
  detector: PlotRectangle,
  axes: PlotAxes,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  let offset = 500;
  if (axes === PlotAxes.milimeter) {
    offset = 100;
  }

  const maxAxis =
    detector.upperBound.x > detector.upperBound.y
      ? detector.upperBound.x
      : detector.upperBound.y;

  return {
    xAxis: new NumericRange(Math.round(-offset), Math.round(maxAxis + offset)),
    yAxis: new NumericRange(Math.round(-offset), Math.round(maxAxis + offset)),
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

export const createPlotEllipse = (
  centre: { x: mathjs.Unit; y: mathjs.Unit },
  diameter: mathjs.Unit,
  plotAxes: PlotAxes,
): PlotEllipse => {
  let xunit = plotAxes as string;
  let yunit = plotAxes as string;

  if (plotAxes === PlotAxes.pixel) {
    xunit = "xpixel";
    yunit = "ypixel";
  }

  const centreVec = new Vector3(
    centre.x.to(xunit).toNumber(),
    centre.y.to(yunit).toNumber(),
  );

  return {
    centre: centreVec,
    endPointX: new Vector3(
      centreVec.x + mathjs.divide(diameter, 2).to(xunit).toNumber(),
      centreVec.y,
    ),
    endPointY: new Vector3(
      centreVec.x,
      centreVec.y + mathjs.divide(diameter, 2).to(yunit).toNumber(),
    ),
  };
};

export interface PlotRectangle {
  upperBound: Vector3;
  lowerBound: Vector3;
}

export const createPlotRectangle = (
  pinnedCorner: Vector3,
  resolution: { height: number; width: number },
  pixelSize: { height: number; width: number },
  plotAxes: PlotAxes,
): PlotRectangle => {
  let fullWidth = resolution.width;
  let fullHeight = resolution.height;
  switch (plotAxes) {
    case PlotAxes.milimeter:
      fullWidth *= pixelSize.width;
      fullHeight *= pixelSize.height;
  }
  return {
    lowerBound: pinnedCorner,
    upperBound: new Vector3(fullWidth, fullHeight),
  };
};

export interface PlotRange {
  start: Vector3;
  end: Vector3;
}

export const createPlotRange = (
  startPoint: Vector3,
  endPoint: Vector3,
  pixelSize: { height: number; width: number },
  plotAxes: PlotAxes,
): PlotRange => {
  const pixelVector = new Vector3(pixelSize.width, pixelSize.height);

  if (plotAxes === PlotAxes.pixel) {
    return {
      start: startPoint.clone().divide(pixelVector),
      end: endPoint.clone().divide(pixelVector),
    };
  }

  return {
    start: startPoint,
    end: endPoint,
  };
};
