import * as mathjs from "mathjs";
import { Vector3 } from "three";
import { PlotAxes } from "./plotStore";
import { PlotEllipse, PlotRange, PlotRectangle, UnitVector } from "./plotUtils";

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
      centre.y.to(this.yunit).toNumber(),
    );
  }

  createPlotEllipse(
    centre: UnitVector,
    diameter: math.Unit,
    beamstopCentre: UnitVector,
  ): PlotEllipse {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      const eclipseCentre = this._getCentreVector(centre);

      const endPointX = new Vector3(
        eclipseCentre.x + mathjs.divide(diameter, 2).to(this.xunit).toNumber(),
        eclipseCentre.y,
      );
      const endPointY = new Vector3(
        eclipseCentre.x,
        eclipseCentre.y + mathjs.divide(diameter, 2).to(this.yunit).toNumber(),
      );

      return { centre: eclipseCentre, endPointX, endPointY };
    }

    // todo suggestion consider forcing not null scale factor
    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }
    const newcentre = Plotter.convert2QSpace(
      centre,
      this.scaleFactor,
      beamstopCentre,
    );
    const newcentreVec = this._getCentreVector(newcentre);

    const endPointX = new Vector3(
      newcentreVec.x +
        mathjs
          .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
          .to(this.xunit)
          .toNumber(),
      newcentreVec.y,
    );

    const endPointY = new Vector3(
      newcentreVec.x,
      newcentreVec.y + this._scale(diameter, this.yunit),
    );

    return { centre: newcentreVec, endPointX, endPointY };
  }

  createPlotEllipseClearance = (
    centre: UnitVector,
    diameter: math.Unit,
    clearance: number,
    beamstopCentre: UnitVector,
  ): PlotEllipse => {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      const centreVec = this._getCentreVector(centre);

      const endXVector = new Vector3(
        centreVec.x +
          mathjs.divide(diameter, 2).to(this.xunit).toNumber() +
          mathjs.unit(clearance, "xpixel").to(this.xunit).toNumber(),
        centreVec.y,
      );

      const endYVector = new Vector3(
        centreVec.x,
        centreVec.y +
          mathjs.divide(diameter, 2).to(this.yunit).toNumber() +
          mathjs.unit(clearance, "ypixel").to(this.yunit).toNumber(),
      );

      return {
        centre: centreVec,
        endPointX: endXVector,
        endPointY: endYVector,
      };
    }

    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }

    const newcentre = Plotter.convert2QSpace(
      centre,
      this.scaleFactor,
      beamstopCentre,
    );
    const newcentreVec = new Vector3(
      newcentre.x.to(this.xunit).toNumber(),
      newcentre.y.to(this.yunit).toNumber(),
    );

    const endXVector = new Vector3(
      newcentreVec.x +
        mathjs
          .multiply(mathjs.divide(diameter, 2), this.scaleFactor)
          .to(this.xunit)
          .toNumber() +
        mathjs
          .multiply(mathjs.unit(clearance, "xpixel"), this.scaleFactor)
          .to(this.xunit)
          .toNumber(),
      newcentreVec.y,
    );

    const endYVector = new Vector3(
      newcentreVec.x,
      newcentreVec.y +
        this._scale(diameter, this.yunit) +
        mathjs
          .multiply(mathjs.unit(clearance, "ypixel"), this.scaleFactor)
          .to(this.yunit)
          .toNumber(),
    );
    return {
      centre: newcentreVec,
      endPointX: endXVector,
      endPointY: endYVector,
    };
  };

  /**
   * underscore convention to indicate a private method
   * @param diameter
   * @param unit
   * @returns
   */
  private _scale(diameter: mathjs.Unit, unit: string): number {
    // todo if the scale factor is forced to be defined then "!" not needed
    return mathjs
      .multiply(mathjs.divide(diameter, 2), this.scaleFactor!)
      .to(unit)
      .toNumber();
  }

  public createPlotRectangle(
    resolution: { height: number; width: number },
    beamstopCentre: UnitVector,
  ): PlotRectangle {
    if (this.plotAxes !== PlotAxes.reciprocal) {
      const lowerBound = new Vector3(0, 0);
      const upperBound = new Vector3(
        mathjs.unit(resolution.width, "xpixel").to(this.xunit).toNumber(),
        mathjs.unit(resolution.height, "ypixel").to(this.yunit).toNumber(),
      );
      // todo putting logic in the return line makes the code less clear
      return { lowerBound, upperBound };
    }

    if (!this.scaleFactor) {
      throw TypeError("reciprocal units need a scaleFactor");
    }

    const { lowerBoundVector, upperBoundVector } = this._getVectorBounds(
      beamstopCentre,
      resolution,
    );

    return { lowerBound: lowerBoundVector, upperBound: upperBoundVector };
  }

  public createPlotRange = (
    startPoint: UnitVector,
    endPoint: UnitVector,
    beamstopCentre: UnitVector,
  ): PlotRange => {
    if (this.plotAxes === PlotAxes.reciprocal) {
      if (!this.scaleFactor) {
        throw TypeError("reciprocal units need a scaleFactor");
      }
      startPoint = Plotter.convert2QSpace(
        startPoint,
        this.scaleFactor,
        beamstopCentre,
      );
      endPoint = Plotter.convert2QSpace(
        endPoint,
        this.scaleFactor,
        beamstopCentre,
      );
    }

    const startVector = new Vector3(
      startPoint.x.to(this.xunit).toNumber(),
      startPoint.y.to(this.yunit).toNumber(),
    );

    const endVector = new Vector3(
      endPoint.x.to(this.xunit).toNumber(),
      endPoint.y.to(this.yunit).toNumber(),
    );

    return { start: startVector, end: endVector };
  };

  static convert2QSpace = (
    value: UnitVector,
    scaleFactor: mathjs.Unit,
    beamstopCentre: UnitVector,
  ): UnitVector => {
    return {
      x: mathjs.multiply(
        scaleFactor,
        mathjs.subtract(value.x, beamstopCentre.x),
      ),
      y: mathjs.multiply(
        scaleFactor,
        mathjs.subtract(value.y, beamstopCentre.y),
      ),
    };
  };

  private _getVectorBounds(
    beamstopCentre: UnitVector,
    resolution: { height: number; width: number },
  ) {
    const lowerBound = Plotter.convert2QSpace(
      { x: mathjs.unit(0, "xpixel"), y: mathjs.unit(0, "ypixel") },
      this.scaleFactor!,
      beamstopCentre,
    );

    const lowerBoundVector = new Vector3(
      lowerBound.x.to(this.xunit).toNumber(),
      lowerBound.y.to(this.yunit).toNumber(),
    );

    const upperBoundVector = new Vector3(
      lowerBound.x.to(this.xunit).toNumber() +
        mathjs
          .multiply(mathjs.unit(resolution.width, "xpixel"), this.scaleFactor!)
          .to(this.xunit)
          .toNumber(),
      lowerBound.y.to(this.yunit).toNumber() +
        mathjs
          .multiply(mathjs.unit(resolution.height, "ypixel"), this.scaleFactor!)
          .to(this.yunit)
          .toNumber(),
    );
    return { lowerBoundVector, upperBoundVector };
  }
}
