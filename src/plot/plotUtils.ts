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


export interface PlotRectangle {
  upperBound: Vector3;
  lowerBound: Vector3;
}



export interface PlotRange {
  start: Vector3;
  end: Vector3;
}

export class Plotter {
  plotAxes: PlotAxes;
  private xunit: string;
  private yunit: string;
  private scaleFactor: mathjs.Unit | null;
  constructor(plotAxes: PlotAxes, scaleFactor: mathjs.Unit | null) {
    this.xunit = plotAxes as string;
    this.yunit = plotAxes as string;
    this.plotAxes = plotAxes;
    this.scaleFactor = scaleFactor;
    if (plotAxes === PlotAxes.pixel) {
      this.xunit = "xpixel";
      this.yunit = "ypixel";
    }
  }

  createPlotEllipse(
    centre: UnitVector,
    diameter: math.Unit,
  ): PlotEllipse {
    const centreVec = new Vector3(
      centre.x.to(this.xunit).toNumber(),
      centre.y.to(this.yunit).toNumber(),
    );

    return {
      centre: centreVec,
      endPointX: new Vector3(
        centreVec.x + mathjs.divide(diameter, 2).to(this.xunit).toNumber(),
        centreVec.y,
      ),
      endPointY: new Vector3(
        centreVec.x,
        centreVec.y + mathjs.divide(diameter, 2).to(this.yunit).toNumber(),
      ),
    };
  }

  createPlotEllipseClearance = (
    centre: UnitVector,
    diameter: math.Unit,
    clearance: number,
  ): PlotEllipse => {

    const centreVec = new Vector3(
      centre.x.to(this.xunit).toNumber(),
      centre.y.to(this.yunit).toNumber(),
    );

    return {
      centre: centreVec,
      endPointX: new Vector3(
        centreVec.x + mathjs.divide(diameter, 2).to(this.xunit).toNumber() + mathjs.unit(clearance, "xpixel").to(this.xunit).toNumber(),
        centreVec.y,
      ),
      endPointY: new Vector3(
        centreVec.x,
        centreVec.y + mathjs.divide(diameter, 2).to(this.yunit).toNumber() + mathjs.unit(clearance, "ypixel").to(this.yunit).toNumber(),
      ),
    };
  };

  createPlotRectangle(
    resolution: { height: number; width: number },
  ): PlotRectangle {
    return {
      lowerBound: new Vector3(0, 0),
      upperBound: new Vector3(mathjs.unit(resolution.width, "xpixel").to(this.xunit).toNumber(), mathjs.unit(resolution.height, "ypixel").to(this.yunit).toNumber()),
    };
  }

  createPlotRange = (
    startPoint: UnitVector,
    endPoint: UnitVector,
  ): PlotRange => {
    return {
      start: new Vector3(startPoint.x.to(this.xunit).toNumber(), startPoint.y.to(this.yunit).toNumber()),
      end: new Vector3(endPoint.x.to(this.xunit).toNumber(), endPoint.y.to(this.yunit).toNumber()),
    };
  };
}

