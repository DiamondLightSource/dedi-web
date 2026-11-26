import * as mathjs from "mathjs";
import { Vector2, Vector3 } from "three";
import {
  PlotCalibrant,
  PlotEllipse,
  PlotRange,
  PlotRectangle,
} from "./plotUtils";
import {
  AppBeamline,
  AppBeamstop,
  AppCircularDevice,
  AppDetector,
  Calibrant,
} from "../utils/types";
import { LengthUnits } from "../utils/units";
import { UnitVector } from "../calculations/unitVector";
import { lengthToPixels, pixelPosition } from "../calculations/pixels";
import { PlotAxes } from "./plotStore";
import UnitRange from "../calculations/unitRange";
import {
  getPointForQ,
  calculateDistanceFromQValue,
  calculateQValue,
} from "../calculations/qvalue";
import { convertFromDtoQ } from "../results/scatteringQuantities";

/** Maps a pair of mathjs Units (x, y) to a plot-space Vector3. */
type CoordinateTransform = (x: mathjs.Unit, y: mathjs.Unit) => Vector3;

/** Plots in physical millimetres. */
const millimetreTransform: CoordinateTransform = (x, y) =>
  new Vector3(x.to("mm").toNumber(), y.to("mm").toNumber());

/** Plots in detector pixel coordinates. */
function makePixelTransform(detector: AppDetector): CoordinateTransform {
  return (x, y) =>
    new Vector3(
      lengthToPixels(x, detector.pixelSize.width),
      lengthToPixels(y, detector.pixelSize.height),
    );
}

/**
 * Plots in reciprocal space (nm⁻¹), centred on the beamstop. Each point is
 * placed at its exact |q| = 4π·sin(θ)/λ, tan(2θ) = r/L, along its direction
 * from the beam centre. Lines through the beam centre and rings around it map
 * exactly; other straight edges (detector, mask) are curved in q-space and are
 * only approximated by the shapes drawn through their mapped points.
 */
function makeReciprocalTransform(
  wavelength: mathjs.Unit,
  cameraLength: mathjs.Unit,
  centre: UnitVector,
): CoordinateTransform {
  const lambda = wavelength.toNumber(LengthUnits.metre);
  const L = cameraLength.toNumber(LengthUnits.metre);
  const cx = centre.x.toNumber(LengthUnits.metre);
  const cy = centre.y.toNumber(LengthUnits.metre);
  return (x, y) => {
    const dx = x.toNumber(LengthUnits.metre) - cx;
    const dy = y.toNumber(LengthUnits.metre) - cy;
    const r = Math.hypot(dx, dy);
    if (r === 0) return new Vector3(0, 0);
    const q = mathjs
      .unit(calculateQValue(r, L, lambda) ?? NaN, "m^-1")
      .toNumber("nm^-1");
    return new Vector3((q * dx) / r, (q * dy) / r);
  };
}

const defaultCameraTube: AppCircularDevice = {
  centre: { x: 0, y: 0 },
  diameter: mathjs.unit(0, LengthUnits.millimetre),
};

export interface PlotObjects {
  plotBeamstop: PlotEllipse;
  plotCameraTube: PlotEllipse;
  plotDetector: PlotRectangle;
  plotClearance: PlotEllipse;
  plotVisibleRange: PlotRange;
  plotRequestedRange: PlotRange;
  plotCalibrant: PlotCalibrant;
}

/**
 * Computes all plot geometry objects from the current instrument state.
 * Returns a plain object — no class instantiation or method calls required
 * at the call site.
 */
export function createPlots(
  beamstop: AppBeamstop,
  detector: AppDetector,
  beamlineConfig: AppBeamline,
  calibrant: Calibrant,
  minPoint: Vector2,
  maxPoint: Vector2,
  requestedRange: UnitRange | null,
  unitAxes: PlotAxes,
  cameraTube?: AppCircularDevice,
): PlotObjects {
  const resolvedCameraTube = cameraTube ?? defaultCameraTube;

  const beamstopCentre = pixelPosition(beamstop.centre, detector);
  const cameraTubeCentre = pixelPosition(resolvedCameraTube.centre, detector);

  const transform = getCoordinateTransform(
    unitAxes,
    beamlineConfig,
    beamstopCentre,
    detector,
  );

  const startVector = transform(
    mathjs.unit(minPoint.x, LengthUnits.metre),
    mathjs.unit(minPoint.y, LengthUnits.metre),
  );

  const endVector = transform(
    mathjs.unit(maxPoint.x, LengthUnits.metre),
    mathjs.unit(maxPoint.y, LengthUnits.metre),
  );

  return {
    plotBeamstop: createEllipseAroundCentre(
      transform,
      beamstopCentre,
      beamstop.diameter,
    ),
    plotCameraTube: createEllipseAroundCentre(
      transform,
      cameraTubeCentre,
      resolvedCameraTube.diameter,
    ),
    plotDetector: createDetector(transform, detector),
    plotClearance: createClearance(
      transform,
      beamstopCentre,
      beamstop,
      detector,
    ),
    plotVisibleRange: { start: startVector, end: endVector },
    plotRequestedRange: createRequestedRange(
      transform,
      requestedRange,
      beamlineConfig,
      beamstopCentre,
    ),
    plotCalibrant: createCalibrant(
      transform,
      calibrant,
      beamlineConfig,
      beamstopCentre,
    ),
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function createEllipseAroundCentre(
  transform: CoordinateTransform,
  centre: UnitVector,
  diameter: mathjs.Unit,
): PlotEllipse {
  const radius = mathjs.divide(diameter, 2);
  return {
    centre: transform(centre.x, centre.y),
    endPointX: transform(mathjs.add(centre.x, radius), centre.y),
    endPointY: transform(centre.x, mathjs.add(centre.y, radius)),
  };
}

function createDetector(
  transform: CoordinateTransform,
  detector: AppDetector,
): PlotRectangle {
  const lower = pixelPosition({ x: 0, y: 0 }, detector);
  const upper = pixelPosition(
    { x: detector.resolution.width, y: detector.resolution.height },
    detector,
  );
  return {
    lowerBound: transform(lower.x, lower.y),
    upperBound: transform(upper.x, upper.y),
  };
}

function createClearance(
  transform: CoordinateTransform,
  beamstopCentre: UnitVector,
  beamstop: AppBeamstop,
  detector: AppDetector,
): PlotEllipse {
  const radius = mathjs.divide(beamstop.diameter, 2);
  const clearancePx = beamstop.clearance ?? 0;
  const clearance = pixelPosition({ x: clearancePx, y: clearancePx }, detector);
  return {
    centre: transform(beamstopCentre.x, beamstopCentre.y),
    endPointX: transform(
      mathjs.add(mathjs.add(beamstopCentre.x, radius), clearance.x),
      beamstopCentre.y,
    ),
    endPointY: transform(
      beamstopCentre.x,
      mathjs.add(mathjs.add(beamstopCentre.y, radius), clearance.y),
    ),
  };
}

function createRequestedRange(
  transform: CoordinateTransform,
  requestedRange: UnitRange | null,
  beamlineConfig: AppBeamline,
  beamstopCentre: UnitVector,
): PlotRange {
  if (requestedRange === null) {
    return { start: new Vector3(0, 0), end: new Vector3(0, 0) };
  }
  const camLen = mathjs.unit(
    beamlineConfig.cameraLength ?? NaN,
    LengthUnits.metre,
  );
  const minPt = getPointForQ(
    requestedRange.min,
    beamlineConfig.angle,
    camLen,
    beamlineConfig.wavelength,
    beamstopCentre,
  );
  const maxPt = getPointForQ(
    requestedRange.max,
    beamlineConfig.angle,
    camLen,
    beamlineConfig.wavelength,
    beamstopCentre,
  );
  return {
    start: transform(minPt.x, minPt.y),
    end: transform(maxPt.x, maxPt.y),
  };
}

function createCalibrant(
  transform: CoordinateTransform,
  calibrant: Calibrant,
  beamlineConfig: AppBeamline,
  beamstopCentre: UnitVector,
): PlotCalibrant {
  const zeroCalibrant = {
    endPointX: transform(beamstopCentre.x, beamstopCentre.y),
    endPointY: transform(beamstopCentre.x, beamstopCentre.y),
    ringFractions: [],
  };

  if (isNaN(beamlineConfig.wavelength.toNumber()) || calibrant.d.length === 0) {
    return zeroCalibrant;
  }

  const camLen = mathjs.unit(
    beamlineConfig.cameraLength ?? NaN,
    LengthUnits.metre,
  );

  const camLenSI = camLen.toSI().toNumber();
  const waveSI = beamlineConfig.wavelength.toSI().toNumber();

  // Filter to only d-spacings that are physically accessible at this wavelength
  const accessibleD = calibrant.d.filter((d) => {
    const q = convertFromDtoQ(mathjs.unit(d, "nm")).toSI().toNumber();
    return calculateDistanceFromQValue(q, camLenSI, waveSI) !== null;
  });

  if (accessibleD.length === 0) {
    return zeroCalibrant;
  }

  const maxRing = Math.min(...accessibleD);
  const qValue = convertFromDtoQ(mathjs.unit(maxRing, "nm"));

  const ptX = getPointForQ(
    qValue,
    mathjs.unit(0, "deg"),
    camLen,
    beamlineConfig.wavelength,
    beamstopCentre,
  );
  const ptY = getPointForQ(
    qValue,
    mathjs.unit(90, "deg"),
    camLen,
    beamlineConfig.wavelength,
    beamstopCentre,
  );

  // Ring radii as fractions of the outermost ring, measured in plot space
  // (along +x) so they suit any axes: distance ratios on mm/pixel axes,
  // q ratios on q axes.
  const centre = transform(beamstopCentre.x, beamstopCentre.y);
  const endPointX = transform(ptX.x, ptX.y);
  const radiusInPlot = (d: number) => {
    const pt = getPointForQ(
      convertFromDtoQ(mathjs.unit(d, "nm")),
      mathjs.unit(0, "deg"),
      camLen,
      beamlineConfig.wavelength,
      beamstopCentre,
    );
    return transform(pt.x, pt.y).x - centre.x;
  };
  const maxRadius = endPointX.x - centre.x;

  return {
    endPointX,
    endPointY: transform(ptY.x, ptY.y),
    ringFractions: accessibleD.map((d) => radiusInPlot(d) / maxRadius),
  };
}

function getCoordinateTransform(
  unitAxes: PlotAxes,
  beamlineConfig: AppBeamline,
  beamstopCentre: UnitVector,
  detector: AppDetector,
): CoordinateTransform {
  if (
    unitAxes === PlotAxes.reciprocal &&
    beamlineConfig.cameraLength != null &&
    !isNaN(beamlineConfig.wavelength.toNumber())
  ) {
    return makeReciprocalTransform(
      beamlineConfig.wavelength,
      mathjs.unit(beamlineConfig.cameraLength, LengthUnits.metre),
      beamstopCentre,
    );
  }
  if (unitAxes === PlotAxes.pixel) {
    return makePixelTransform(detector);
  }
  return millimetreTransform;
}
