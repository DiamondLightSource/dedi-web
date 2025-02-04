import { Vector2, Vector3 } from "three";
import { AppBeamstop, AppCircularDevice, AppDetector } from "../utils/types";
import { PlotEllipse, PlotRectangle, PlotRange } from "./plotUtils";
import { LengthUnits } from "../utils/units";
import { PlotAxes } from "./plotStore";
import * as mathjs from "mathjs";

export interface NewPlotter {
  createCameratube: () => PlotEllipse;
  createBeamstop: () => PlotEllipse;
  createDetector: () => PlotRectangle;
  createClearnace: () => PlotEllipse;
  createVisibleRange: () => PlotRange;
}

export class MilimeterPlotter implements NewPlotter {
  private beamstop: AppBeamstop;
  private cameraTube: AppCircularDevice;
  private detector: AppDetector;
  private beamstopCentre: Vector3;
  private cameraTubeCentre: Vector3;
  private startVector: Vector3;
  private endVector: Vector3;

  constructor(
    beamstop: AppBeamstop,
    cameraTube: AppCircularDevice,
    detector: AppDetector,
    minPoint: Vector2,
    maxPoint: Vector2,
  ) {
    this.beamstop = beamstop;
    this.cameraTube = cameraTube;
    this.detector = detector;
    this.beamstopCentre = new Vector3(
      mathjs
        .unit(this.beamstop.centre.x ?? NaN, "xpixel")
        .to("mm")
        .toNumber(),
      mathjs
        .unit(this.beamstop.centre.y ?? NaN, "ypixel")
        .to("mm")
        .toNumber(),
    );
    this.cameraTubeCentre = new Vector3(
      mathjs
        .unit(cameraTube.centre.x ?? NaN, "xpixel")
        .to("mm")
        .toNumber(),
      mathjs
        .unit(cameraTube.centre.y ?? NaN, "ypixel")
        .to("mm")
        .toNumber(),
    );
    this.startVector = new Vector3(
      mathjs.unit(minPoint.x, LengthUnits.metre).to("mm").toNumber(),
      mathjs.unit(minPoint.y, LengthUnits.metre).to("mm").toNumber(),
    );

    this.endVector = new Vector3(
      mathjs.unit(maxPoint.x, LengthUnits.metre).to("mm").toNumber(),
      mathjs.unit(maxPoint.y, LengthUnits.metre).to("mm").toNumber(),
    );
  }

  public createBeamstop(): PlotEllipse {
    return createEllipseAroundCentre(
      this.beamstopCentre,
      this.beamstop.diameter,
      PlotAxes.milimeter,
    );
  }

  public createCameratube(): PlotEllipse {
    return createEllipseAroundCentre(
      this.cameraTubeCentre,
      this.cameraTube.diameter,
      PlotAxes.milimeter,
    );
  }

  public createClearnace(): PlotEllipse {
    const endPointX = new Vector3(
      this.beamstopCentre.x +
        mathjs.divide(this.beamstop.diameter, 2).to("mm").toNumber() +
        mathjs
          .unit(this.beamstop.clearance ?? 0, "xpixel")
          .to("mm")
          .toNumber(),
      this.beamstopCentre.y,
    );

    const endPointY = new Vector3(
      this.beamstopCentre.x,
      this.beamstopCentre.y +
        mathjs.divide(this.beamstop.diameter, 2).to("mm").toNumber() +
        mathjs
          .unit(this.beamstop.clearance ?? 0, "ypixel")
          .to("mm")
          .toNumber(),
    );
    return { centre: this.beamstopCentre, endPointX, endPointY };
  }

  public createDetector(): PlotRectangle {
    const lowerBound = new Vector3(0, 0);
    const upperBound = new Vector3(
      mathjs.unit(this.detector.resolution.width, "xpixel").to("mm").toNumber(),
      mathjs
        .unit(this.detector.resolution.height, "ypixel")
        .to("mm")
        .toNumber(),
    );
    return { lowerBound, upperBound };
  }

  public createVisibleRange(): PlotRange {
    return { start: this.startVector, end: this.endVector };
  }
}

// export class PixelPlotter implements NewPlotter {
//   constructor(
//     private beamstop: AppBeamstop,
//     private cameraTube: AppCircularDevice,
//     private detector: AppDetector,
//     private minPoint: Vector2,
//     private maxPoint: Vector2,
//   ) {}
// }

// export class ReciprocalPlotter implements NewPlotter {
//   constructor(
//     private beamstop: AppBeamstop,
//     private cameraTube: AppCircularDevice,
//     private detector: AppDetector,
//     private minPoint: Vector2,
//     private maxPoint: Vector2,
//   ) {}
// }

// helper functions

function createEllipseAroundCentre(
  centre: Vector3,
  diameter: mathjs.Unit,
  resultUnits: PlotAxes,
): PlotEllipse {
  const endPointX = new Vector3(
    centre.x +
      mathjs
        .divide(diameter, 2)
        .to(resultUnits as string)
        .toNumber(),
    centre.y,
  );
  const endPointY = new Vector3(
    centre.x,
    centre.y +
      mathjs
        .divide(diameter, 2)
        .to(resultUnits as string)
        .toNumber(),
  );
  return { centre: centre, endPointX, endPointY };
}
