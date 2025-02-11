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
import { convertFromDtoQ } from "../results/scatteringQuantities";

interface AxisUnitStrategy {
  convert: (x: mathjs.Unit, y: mathjs.Unit) => Vector3;
}

/**
 * Plotting strategy for plotting in mm
 */
class MilimeterAxis implements AxisUnitStrategy {
  public convert(x: mathjs.Unit, y: mathjs.Unit): Vector3 {
    return new Vector3(x.to("mm").toNumber(), y.to("mm").toNumber());
  }
}

/**
 * Plotting strategy for plotting in detector pixels
 */
class PixelAxis implements AxisUnitStrategy {
  public convert(x: mathjs.Unit, y: mathjs.Unit): Vector3 {
    return new Vector3(x.to("xpixel").toNumber(), y.to("ypixel").toNumber());
  }
}

/**
 * Plotting strategy for plotting in reciprical units
 */
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

/**
 * The methods a plotter object must expose
 */
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

    this.unitStrategy = this._getAxisUnitStrategy(unitAxes);

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

  /**
   * Creates a PlotEllipse object representing a clearance around the beamstop
   * @returns
   */
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

    const centre = this.unitStrategy.convert(
      this.beamstopCentre.x,
      this.beamstopCentre.y,
    );

    return {
      centre: centre,
      endPointX,
      endPointY,
    };
  }

  /**
   * Creates a PlotRectangle object which represents the detector
   * @returns
   */
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

  public createCalibrant(): PlotCalibrant {
    // If no wavelength is given
    if (isNaN(this.beamlineConfig.wavelength.toNumber())) {
      return {
        endPointX: this.unitStrategy.convert(
          this.beamstopCentre.x,
          this.beamstopCentre.y,
        ),
        endPointY: this.unitStrategy.convert(
          this.beamstopCentre.x,
          this.beamstopCentre.y,
        ),
        ringFractions: [],
      };
    }

    // Note the reciprocal relationship between q and d
    const maxRing = Math.min(...this.calibrant.d);
    const qValue = convertFromDtoQ(mathjs.unit(maxRing, "nm"));

    const maxPointX = getPointForQ(
      qValue,
      mathjs.unit(0, "deg"),
      mathjs.unit(this.beamlineConfig.cameraLength ?? NaN, LengthUnits.metre),
      this.beamlineConfig.wavelength,
      this.beamstopCentre,
    );

    const maxPointY = getPointForQ(
      qValue,
      mathjs.unit(90, "deg"),
      mathjs.unit(this.beamlineConfig.cameraLength ?? NaN, LengthUnits.metre),
      this.beamlineConfig.wavelength,
      this.beamstopCentre,
    );

    const ringFractions = this.calibrant.d.map((item) => maxRing / item);

    return {
      endPointX: this.unitStrategy.convert(maxPointX.x, maxPointX.y),
      endPointY: this.unitStrategy.convert(maxPointY.x, maxPointY.y),
      ringFractions: ringFractions,
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

  /**
   * Selects plotting strategy
   * @param unitAxes The selected units of the plot
   * @returns
   */
  private _getAxisUnitStrategy(unitAxes: PlotAxes): AxisUnitStrategy {
    if (
      unitAxes === PlotAxes.reciprocal &&
      this.beamlineConfig.cameraLength &&
      this.beamlineConfig.wavelength
    ) {
      const scaleFactor = this._getScaleFactor(
        this.beamlineConfig.wavelength,
        this.beamlineConfig.cameraLength,
      );
      return new ReciprocalAxis(scaleFactor, this.beamstopCentre);
    }

    if (unitAxes === PlotAxes.pixel) {
      return new PixelAxis();
    }

    return new MilimeterAxis();
  }
}
