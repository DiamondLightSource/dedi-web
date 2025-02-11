import * as mathjs from "mathjs";
import { Vector2, Vector3 } from "three";
import QSpace, { DetectorProperties } from "../calculations/qspace";
import { Ray } from "../calculations/ray";
import {
  BeamlineConfig,
  AppBeamstop,
  AppCircularDevice,
  AppDetector,
} from "../utils/types";
import NumericRange from "./numericRange";
import { formatLogMessage } from "../utils/units";
import { UnitVector } from "./unitVector";

/**
 * Is returned from computeQrange if the full
 * calculation cannot be completed.
 */
const defaultReturn = {
  minPoint: new Vector2(0, 0),
  maxPoint: new Vector2(0, 0),
  visibleQRange: null,
  fullQRange: null,
};

// todo suggestion: this function is quite big.
// I created blocks in it with comments (not the only way to do this)
/**
 * Computes the qrange given detector, beamstop, cameraTube, and Beamproperties
 * @param detector
 * @param beamstop
 * @param cameraTube
 * @param beamProperties
 * @returns
 */
export function computeQrange(
  detector: AppDetector,
  beamstop: AppBeamstop,
  cameraTube: AppCircularDevice,
  beamProperties: BeamlineConfig,
): {
  minPoint: Vector2;
  maxPoint: Vector2;
  visibleQRange: NumericRange | null;
  fullQRange: NumericRange | null;
} {
  const {
    clearanceDimensions,
    beamcentre,
    detectorDimensions,
    cameraTubeDimensions,
    cameraLength,
  } = getRightUnits(beamProperties, beamstop, detector, cameraTube);

  // Use angle to get ray direction
  const rayDirection = new Vector2(
    mathjs.cos(beamProperties.angle),
    mathjs.sin(beamProperties.angle),
  );

  // Find the rays initial position (on the perimeter of the circle)
  const initialPosition = clearanceDimensions
    .multiply(rayDirection)
    .add(beamcentre)
    .toSI()
    .toVector2();

  // Create ray
  const ray = new Ray(rayDirection, initialPosition);

  // Get the scalar range where the ray intersects with the detector
  const topLeftCorner = new Vector2(0, detectorDimensions.y.toSI().toNumber());
  const detectorIntersectionRange = ray.getRectangleIntersectionRange(
    topLeftCorner,
    detectorDimensions.toSI().toVector2(),
  );

  if (detectorIntersectionRange === null) {
    console.warn(formatLogMessage("Ray does not intersect with detector"));
    return defaultReturn;
  }

  // Get the scalar range where the ray intersects with the cameratube
  // Then the insection of the detector and camera tube ranges
  let intersection: NumericRange | null = detectorIntersectionRange;

  const cameraOk =
    cameraTube !== null && cameraTube.diameter.toSI().toNumber() !== 0;

  if (cameraOk) {
    const radius = mathjs.divide(cameraTube.diameter, 2).toSI().toNumber();
    const centre = cameraTubeDimensions.toSI().toVector2();
    intersection = detectorIntersectionRange.intersect(
      ray.getCircleIntersectionRange(radius, centre),
    );
  }

  if (intersection === null) {
    console.warn(
      formatLogMessage(
        "No intersection between Ray, Camera tube, and Detector",
      ),
    );
    return defaultReturn;
  }

  // Get the points points for the intersection range
  const minPoint = ray.getPoint(intersection.min);
  const maxPoint = ray.getPoint(intersection.max);

  const origin = beamcentre.toSI().toVector3(cameraLength.toSI().toNumber());

  // Assume neam hits detector orthogonally
  const beamVector = new Vector3(0, 0, 1);

  // group together the data needed for detector infomation
  const detProps: DetectorProperties = { origin, beamVector };

  const qspace = new QSpace(
    detProps,
    beamProperties.wavelength.toSI().toNumber(),
  );

  // get visible range
  const visibleQMin = qspace.qFromPixelPosition(minPoint);
  const visibleQMax = qspace.qFromPixelPosition(maxPoint);

  // get the min
  detProps.origin.z = beamProperties.beamline.minCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.beamline.minWavelength.toSI().toNumber(),
  );
  const fullQMin = qspace.qFromPixelPosition(maxPoint);

  // get the max
  detProps.origin.z = beamProperties.beamline.maxCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.beamline.maxWavelength.toSI().toNumber(),
  );
  const fullQMax = qspace.qFromPixelPosition(minPoint);

  const visibleQRange = new NumericRange(
    visibleQMin.length(),
    visibleQMax.length(),
  );

  const fullQRange = new NumericRange(fullQMin.length(), fullQMax.length());

  console.info(
    formatLogMessage(` The visible q range is: ${visibleQRange.toString()}`),
  );
  console.info(
    formatLogMessage(` The full q range is: ${fullQRange.toString()}`),
  );

  return { minPoint, maxPoint, visibleQRange, fullQRange };
}

/**
 * Convert values from app into units needed for calculating qrange.
 * @param beamProperties Information relating to the beamline
 * @param beamstop Information relating to the beamstop
 * @param detector Information relating to the detector
 * @param cameraTube information relating to the cameraTube
 * @returns Information needed to calculate qrange in correct units.
 */
function getRightUnits(
  beamProperties: BeamlineConfig,
  beamstop: AppBeamstop,
  detector: AppDetector,
  cameraTube: AppCircularDevice,
): {
  clearanceDimensions: UnitVector;
  beamcentre: UnitVector;
  detectorDimensions: UnitVector;
  cameraTubeDimensions: UnitVector;
  cameraLength: mathjs.Unit;
} {
  const cameraLength = mathjs.unit(beamProperties.cameraLength ?? NaN, "m");

  const beamtopRadius = mathjs.divide(beamstop.diameter, 2);

  const clearanceDimensions = new UnitVector(
    mathjs.unit(beamstop.clearance ?? NaN, "xpixel"),
    mathjs.unit(beamstop.clearance ?? NaN, "ypixel"),
  ).add(new UnitVector(beamtopRadius, beamtopRadius));

  const beamcentre = new UnitVector(
    mathjs.unit(beamstop.centre.x ?? NaN, "xpixel"),
    mathjs.unit(beamstop.centre.y ?? NaN, "ypixel"),
  );

  const detectorDimensions = new UnitVector(
    mathjs.unit(detector.resolution.width, "xpixel"),
    mathjs.unit(detector.resolution.height, "ypixel"),
  );

  const cameraTubeDimensions = new UnitVector(
    mathjs.unit(cameraTube.centre.x ?? NaN, "xpixel"),
    mathjs.unit(cameraTube.centre.y ?? NaN, "ypixel"),
  );

  return {
    clearanceDimensions,
    beamcentre,
    detectorDimensions,
    cameraTubeDimensions,
    cameraLength,
  };
}
