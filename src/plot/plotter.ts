import * as mathjs from "mathjs";
import { Vector2, Vector3 } from "three";
import {
  PlotCalibrant,
  PlotEllipse,
  PlotRange,
  PlotRectangle,
} from "./plotUtils";
import {
  AppBeamstop,
  AppCircularDevice,
  AppDetector,
  BeamlineConfig,
  Calibrant,
} from "../utils/types";
import { LengthUnits } from "../utils/units";
import { UnitVector } from "../calculations/unitVector";
import { PlotAxes } from "./plotStore";
import UnitRange from "../calculations/unitRange";
import { getPointForQ } from "../calculations/qvalue";

interface AxisUnitStrategy {
  convert: (x: mathjs.Unit, y: mathjs.Unit) => Vector3;
}

class MilimeterAxis implements AxisUnitStrategy {
  public convert(x: mathjs.Unit, y: mathjs.Unit): Vector3 {
    return new Vector3(x.to("mm").toNumber(), y.to("mm").toNumber());
  }
}

class PixelAxis implements AxisUnitStrategy {
  public convert(x: mathjs.Unit, y: mathjs.Unit): Vector3 {
    return new Vector3(x.to("xpixel").toNumber(), y.to("ypixel").toNumber());
  }
}

class ReciprocalAxis implements AxisUnitStrategy {
  constructor(
    private scaleFactor: mathjs.Unit,
    private centre: UnitVector,
  ) {}
  public convert(x: mathjs.Unit, y: mathjs.Unit): Vector3 {
    return new Vector3(
      mathjs
        .multiply(this.scaleFactor, mathjs.subtract(x, this.centre.x))
        .to("nm^-1")
        .toNumber(),
      mathjs
        .multiply(this.scaleFactor, mathjs.subtract(y, this.centre.y))
        .to("nm^-1")
        .toNumber(),
    );
  }
}

interface IPlotter {
  createCameratube: () => PlotEllipse;
  createBeamstop: () => PlotEllipse;
  createDetector: () => PlotRectangle;
  createClearnace: () => PlotEllipse;
  createVisibleRange: () => PlotRange;
  createRequestedRange: () => PlotRange;
  createCalibrant: () => PlotCalibrant;
}

export class Plotter implements IPlotter {
  private beamstop: AppBeamstop;
  private cameraTube: AppCircularDevice;
  private detector: AppDetector;
  private beamstopCentre: UnitVector;
  private cameraTubeCentre: UnitVector;
  private startVector: Vector3;
  private endVector: Vector3;
  private unitStrategy: AxisUnitStrategy;
  private requestedRange: UnitRange | null;
  private beamlineConfig: BeamlineConfig;
  private calibrant: Calibrant;

  constructor(
    beamstop: AppBeamstop,
    cameraTube: AppCircularDevice,
    detector: AppDetector,
    beamlineConfig: BeamlineConfig,
    calibrant: Calibrant,
    minPoint: Vector2,
    maxPoint: Vector2,
    requestedRange: UnitRange | null,
    unitAxes: PlotAxes,
  ) {
    this.beamstop = beamstop;
    this.cameraTube = cameraTube;
    this.detector = detector;
    this.beamlineConfig = beamlineConfig;
    this.requestedRange = requestedRange;
    this.calibrant = calibrant;

    this.beamstopCentre = new UnitVector(
      mathjs.unit(this.beamstop.centre.x ?? NaN, "xpixel"),
      mathjs.unit(this.beamstop.centre.y ?? NaN, "ypixel"),
    );

    this.cameraTubeCentre = new UnitVector(
      mathjs.unit(cameraTube.centre.x ?? NaN, "xpixel"),
      mathjs.unit(cameraTube.centre.y ?? NaN, "ypixel"),
    );

    if (
      unitAxes === PlotAxes.reciprocal &&
      beamlineConfig.cameraLength &&
      beamlineConfig.wavelength
    ) {
      const scaleFactor = this._getScaleFactor(
        beamlineConfig.wavelength,
        beamlineConfig.cameraLength,
      );
      this.unitStrategy = new ReciprocalAxis(scaleFactor, this.beamstopCentre);
    } else if (unitAxes === PlotAxes.pixel) {
      this.unitStrategy = new PixelAxis();
    } else {
      this.unitStrategy = new MilimeterAxis();
    }

    this.startVector = this.unitStrategy.convert(
      mathjs.unit(minPoint.x, LengthUnits.metre),
      mathjs.unit(minPoint.y, LengthUnits.metre),
    );

    this.endVector = this.unitStrategy.convert(
      mathjs.unit(maxPoint.x, LengthUnits.metre),
      mathjs.unit(maxPoint.y, LengthUnits.metre),
    );
  }

  public createBeamstop(): PlotEllipse {
    return this._createEllipseAroundCentre(
      this.beamstopCentre,
      this.beamstop.diameter,
    );
  }

  public createCameratube(): PlotEllipse {
    return this._createEllipseAroundCentre(
      this.cameraTubeCentre,
      this.cameraTube.diameter,
    );
  }

  public createClearnace(): PlotEllipse {
    const radius = mathjs.divide(this.beamstop.diameter, 2);

    const endPointX = this.unitStrategy.convert(
      mathjs.add(
        mathjs.add(this.beamstopCentre.x, radius),
        mathjs.unit(this.beamstop.clearance ?? 0, "xpixel"),
      ),
      this.beamstopCentre.y,
    );

    const endPointY = this.unitStrategy.convert(
      this.beamstopCentre.x,
      mathjs.add(
        mathjs.add(this.beamstopCentre.y, radius),
        mathjs.unit(this.beamstop.clearance ?? 0, "ypixel"),
      ),
    );

    return {
      centre: this.unitStrategy.convert(
        this.beamstopCentre.x,
        this.beamstopCentre.y,
      ),
      endPointX,
      endPointY,
    };
  }

  public createDetector(): PlotRectangle {
    const lowerBound = this.unitStrategy.convert(
      mathjs.unit(0, "xpixel"),
      mathjs.unit(0, "ypixel"),
    );
    const upperBound = this.unitStrategy.convert(
      mathjs.unit(this.detector.resolution.width, "xpixel"),
      mathjs.unit(this.detector.resolution.height, "ypixel"),
    );
    return { lowerBound, upperBound };
  }

  public createVisibleRange(): PlotRange {
    return {
      start: this.startVector,
      end: this.endVector,
    };
  }

  public createRequestedRange(): PlotRange {
    if (this.requestedRange === null) {
      return {
        start: new Vector3(0, 0),
        end: new Vector3(0, 0),
      };
    }

    const maxPoint = getPointForQ(
      this.requestedRange.max,
      this.beamlineConfig.angle,
      mathjs.unit(this.beamlineConfig.cameraLength ?? NaN, LengthUnits.metre),
      this.beamlineConfig.wavelength,
      this.beamstopCentre,
    );
    const minPoint = getPointForQ(
      this.requestedRange.min,
      this.beamlineConfig.angle,
      mathjs.unit(this.beamlineConfig.cameraLength ?? NaN, LengthUnits.metre),
      this.beamlineConfig.wavelength,
      this.beamstopCentre,
    );

    return {
      start: this.unitStrategy.convert(minPoint.x, minPoint.y),
      end: this.unitStrategy.convert(maxPoint.x, maxPoint.y),
    };
  }

  private _createEllipseAroundCentre(
    centre: UnitVector,
    diameter: mathjs.Unit,
  ): PlotEllipse {
    const radius = mathjs.divide(diameter, 2);
    const endPointX = this.unitStrategy.convert(
      mathjs.add(centre.x, radius),
      centre.y,
    );
    const endPointY = this.unitStrategy.convert(
      centre.x,
      mathjs.add(centre.y, radius),
    );
    return {
      centre: this.unitStrategy.convert(centre.x, centre.y),
      endPointX,
      endPointY,
    };
  }

  public createCalibrant(): PlotCalibrant {
    const max_ring = Math.max(...this.calibrant.d);
    const max_ellipse = this._createEllipseAroundCentre(
      this.beamstopCentre,
      mathjs.unit(max_ring, "mm"),
    );
    return {
      endPointX: max_ellipse.endPointX,
      endPointY: max_ellipse.endPointY,
      ringFractions: this.calibrant.d.map((item) => item / max_ring),
    };
  }

  private _getScaleFactor(wavelength: mathjs.Unit, cameraLength: number) {
    const scaleFactor = mathjs.divide(
      2 * Math.PI,
      mathjs.multiply(
        mathjs.unit(cameraLength, LengthUnits.metre),
        wavelength.to(LengthUnits.metre),
      ),
    );
    if (typeof scaleFactor == "number" || !("units" in scaleFactor)) {
      throw TypeError("scaleFactor should be a unit not a number");
    }
    return scaleFactor;
  }
}
