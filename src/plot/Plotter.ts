import { PlotAxes } from "./plotStore";
import { Vector3 } from "three";
import * as mathjs from "mathjs";
import { UnitVector, PlotEllipse, PlotRectangle, PlotRange } from "./plotUtils";


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

  private _getCentreVector(centre: UnitVector): Vector3 {
    return new Vector3(
      centre.x.to(this.xunit).toNumber(),
      centre.y.to(this.yunit).toNumber()
    );
  }

  createPlotEllipse(
    centre: UnitVector,
    diameter: math.Unit,
    beamstopCentre: UnitVector
  ): PlotEllipse {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      const eclipseCentre = this._getCentreVector(centre);

      const endPointx = new Vector3(
        eclipseCentre.x + mathjs.divide(diameter, 2).to(this.xunit).toNumber(),
        eclipseCentre.y
      );
      const endPointY = new Vector3(
        eclipseCentre.x,
        eclipseCentre.y + mathjs.divide(diameter, 2).to(this.yunit).toNumber()
      );

      return { centre: eclipseCentre, endPointX, endPointY };
    }

    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }
    const newcentre = Plotter.convert2QSpace(
      centre,
      this.scaleFactor,
      beamstopCentre
    );
    const newcentreVec = this._getCentreVector(newcentre);

    const endPointX = new Vector3(
      newcentreVec.x +
      mathjs
        .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
        .to(this.xunit)
        .toNumber(),
      newcentreVec.y
    );

    const endPointY = new Vector3(
      newcentreVec.x,
      newcentreVec.y +
      mathjs
        .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
        .to(this.yunit)
        .toNumber()
    );

    return { centre: newcentreVec, endPointX, endPointY };
  }

  createPlotEllipseClearance = (
    centre: UnitVector,
    diameter: math.Unit,
    clearance: number,
    beamstopCentre: UnitVector
  ): PlotEllipse => {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      const centreVec = this._getCentreVector(centre);

      return {
        centre: centreVec,
        endPointX: new Vector3(
          centreVec.x +
          mathjs.divide(diameter, 2).to(this.xunit).toNumber() +
          mathjs.unit(clearance, "xpixel").to(this.xunit).toNumber(),
          centreVec.y
        ),
        endPointY: new Vector3(
          centreVec.x,
          centreVec.y +
          mathjs.divide(diameter, 2).to(this.yunit).toNumber() +
          mathjs.unit(clearance, "ypixel").to(this.yunit).toNumber()
        ),
      };
    }

    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }

    const newcentre = Plotter.convert2QSpace(
      centre,
      this.scaleFactor,
      beamstopCentre
    );
    const newcentreVec = new Vector3(
      newcentre.x.to(this.xunit).toNumber(),
      newcentre.y.to(this.yunit).toNumber()
    );
    return {
      centre: newcentreVec,
      endPointX: new Vector3(
        newcentreVec.x +
        mathjs
          .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
          .to(this.xunit)
          .toNumber() +
        mathjs
          .multiply(mathjs.unit(clearance, "xpixel"), this.scaleFactor)
          .to(this.xunit)
          .toNumber(),
        newcentreVec.y
      ),
      endPointY: new Vector3(
        newcentreVec.x,
        newcentreVec.y +
        mathjs
          .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
          .to(this.yunit)
          .toNumber() +
        mathjs
          .multiply(mathjs.unit(clearance, "ypixel"), this.scaleFactor)
          .to(this.yunit)
          .toNumber()
      ),
    };
  };

  createPlotRectangle(
    resolution: { height: number; width: number; },
    beamstopCentre: UnitVector
  ): PlotRectangle {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      return {
        lowerBound: new Vector3(0, 0),
        upperBound: new Vector3(
          mathjs.unit(resolution.width, "xpixel").to(this.xunit).toNumber(),
          mathjs.unit(resolution.height, "ypixel").to(this.yunit).toNumber()
        ),
      };
    }

    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }

    const lowerBound = Plotter.convert2QSpace(
      { x: mathjs.unit(0, "xpixel"), y: mathjs.unit(0, "ypixel") },
      this.scaleFactor,
      beamstopCentre
    );

    return {
      lowerBound: new Vector3(
        lowerBound.x.to(this.xunit).toNumber(),
        lowerBound.y.to(this.yunit).toNumber()
      ),
      upperBound: new Vector3(
        lowerBound.x.to(this.xunit).toNumber() +
        mathjs
          .multiply(mathjs.unit(resolution.width, "xpixel"), this.scaleFactor)
          .to(this.xunit)
          .toNumber(),
        lowerBound.y.to(this.yunit).toNumber() +
        mathjs
          .multiply(
            mathjs.unit(resolution.height, "ypixel"),
            this.scaleFactor
          )
          .to(this.yunit)
          .toNumber()
      ),
    };
  }

  public createPlotRange = (
    startPoint: UnitVector,
    endPoint: UnitVector,
    beamstopCentre: UnitVector
  ): PlotRange => {
    if (this.plotAxes === PlotAxes.reciprocal) {
      if (!this.scaleFactor) {
        throw TypeError("reciprocal units need a scaleFactor");
      }
      startPoint = Plotter.convert2QSpace(
        startPoint,
        this.scaleFactor,
        beamstopCentre
      );
      endPoint = Plotter.convert2QSpace(
        endPoint,
        this.scaleFactor,
        beamstopCentre
      );
    }

    return {
      start: new Vector3(
        startPoint.x.to(this.xunit).toNumber(),
        startPoint.y.to(this.yunit).toNumber()
      ),
      end: new Vector3(
        endPoint.x.to(this.xunit).toNumber(),
        endPoint.y.to(this.yunit).toNumber()
      ),
    };
  };

  static convert2QSpace = (
    value: UnitVector,
    scaleFactor: mathjs.Unit,
    beamstopCentre: UnitVector
  ): UnitVector => {
    return {
      x: mathjs.multiply(
        scaleFactor,
        mathjs.subtract(value.x, beamstopCentre.x)
      ),
      y: mathjs.multiply(
        scaleFactor,
        mathjs.subtract(value.y, beamstopCentre.y)
      ),
    };
  };
}
