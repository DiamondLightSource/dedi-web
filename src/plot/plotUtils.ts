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

export interface UnitVector {
  x: math.Unit,
  y: math.Unit
}

export const createPlotEllipse = (
  centre: UnitVector,
  diameter: math.Unit,
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

export const createPlotEllipseClearance = (
  centre: UnitVector,
  diameter: math.Unit,
  clearance: number,
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
      centreVec.x + mathjs.divide(diameter, 2).to(xunit).toNumber() + mathjs.unit(clearance, "xpixel").to(xunit).toNumber(),
      centreVec.y,
    ),
    endPointY: new Vector3(
      centreVec.x,
      centreVec.y + mathjs.divide(diameter, 2).to(yunit).toNumber() + mathjs.unit(clearance, "ypixel").to(yunit).toNumber(),
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
  plotAxes: PlotAxes,
): PlotRectangle => {
  let xunit = plotAxes as string;
  let yunit = plotAxes as string;
  if (plotAxes === PlotAxes.pixel) {
    xunit = "xpixel";
    yunit = "ypixel";
  }


  return {
    lowerBound: pinnedCorner,
    upperBound: new Vector3(mathjs.unit(resolution.width, "xpixel").to(xunit).toNumber(), mathjs.unit(resolution.height, "ypixel").to(yunit).toNumber()),
  };
};

export interface PlotRange {
  start: Vector3;
  end: Vector3;
}

export const createPlotRange = (
  startPoint: UnitVector,
  endPoint: UnitVector,
  plotAxes: PlotAxes,
): PlotRange => {
  let xunit = plotAxes as string;
  let yunit = plotAxes as string;
  if (plotAxes === PlotAxes.pixel) {
    xunit = "xpixel";
    yunit = "ypixel";
  }

  return {
    start: new Vector3(startPoint.x.to(xunit).toNumber(), startPoint.y.to(yunit).toNumber()),
    end: new Vector3(endPoint.x.to(xunit).toNumber(), endPoint.y.to(yunit).toNumber()),
  };
};
