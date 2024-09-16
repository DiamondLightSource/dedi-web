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

/**
 * Is returned from computeQrange if the full
 * calculation cannot be completed.
 */
const defaultReturn = {
  ptMin: new Vector2(0, 0),
  ptMax: new Vector2(0, 0),
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
  ptMin: Vector2;
  ptMax: Vector2;
  visibleQRange: NumericRange | null;
  fullQRange: NumericRange | null;
} {
  const {
    clearanceWidth,
    beamcentreX,
    clearanceHeight,
    beamcentreY,
    detectorHeight,
    detectorWidth,
    cameraTubeCentreX,
    cemeraTubeCentreY,
    cameraLength,
  } = getRightUnits(beamProperties, beamstop, detector, cameraTube);

  // get initial position x and y
  const initialPositionX = mathjs.add(
    mathjs.multiply(clearanceWidth, mathjs.cos(beamProperties.angle)),
    beamcentreX,
  );

  if (typeof initialPositionX === "number" || !("units" in initialPositionX)) {
    console.error(
      formatLogMessage(
        "Units are wrong for either beamcentre x or clearance width",
      ),
    );
    return defaultReturn;
  }

  const initialPositionY = mathjs.add(
    mathjs.multiply(clearanceHeight, mathjs.sin(beamProperties.angle)),
    beamcentreY,
  );

  if (typeof initialPositionY === "number" || !("units" in initialPositionY)) {
    console.error(
      formatLogMessage(
        "Units are wrong for either beamcentre y or clearance width",
      ),
    );
    return defaultReturn;
  }

  const initialPosition = new Vector2(
    initialPositionX.toSI().toNumber(),
    initialPositionY.toSI().toNumber(),
  );

  const rayDirection = new Vector2(
    mathjs.cos(beamProperties.angle),
    mathjs.sin(beamProperties.angle),
  );

  const ray = new Ray(rayDirection, initialPosition);

  let t1 = ray.getRectangleIntersectionParameterRange(
    new Vector2(0, detectorHeight.toSI().toNumber()),
    detectorWidth.toSI().toNumber(),
    detectorHeight.toSI().toNumber(),
  );

  if (t1 === null) {
    console.warn(formatLogMessage("Ray does not intersect with detector"));
    return defaultReturn;
  }

  const cameraOk =
    cameraTube !== null && cameraTube.diameter.toSI().toNumber() != 0;

  if (cameraOk) {
    const radius = mathjs.divide(cameraTube.diameter, 2).toSI().toNumber();
    const centre = new Vector2(
      cameraTubeCentreX.toSI().toNumber(),
      cemeraTubeCentreY.toSI().toNumber(),
    );
    t1 = t1.intersect(ray.getCircleIntersectionParameterRange(radius, centre));
  }

  if (t1 === null) {
    console.warn(formatLogMessage("Ray does not intersect with camera tube"));
    return defaultReturn;
  }

  // set up the min, max and qspace values
  const ptMin = ray.getPoint(t1.min);
  const ptMax = ray.getPoint(t1.max);

  const origin = new Vector3(
    beamcentreX.toSI().toNumber(),
    beamcentreY.toSI().toNumber(),
    cameraLength.toSI().toNumber(),
  );

  const beamVector = new Vector3(0, 0, 1);

  const detProps: DetectorProperties = { ...detector, origin, beamVector };

  const qspace = new QSpace(
    detProps,
    beamProperties.wavelength.toSI().toNumber(),
    2 * Math.PI,
  );

  // get visible range
  const visibleQMin = qspace.qFromPixelPosition(ptMin);
  const visibleQMax = qspace.qFromPixelPosition(ptMax);

  // get the min
  detProps.origin.z = beamProperties.beamline.minCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.beamline.minWavelength.toSI().toNumber(),
  );
  const fullQMin = qspace.qFromPixelPosition(ptMax);

  // get the max
  detProps.origin.z = beamProperties.beamline.maxCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.beamline.maxWavelength.toSI().toNumber(),
  );
  const fullQMax = qspace.qFromPixelPosition(ptMin);

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
  return { ptMin, ptMax, visibleQRange, fullQRange };
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
) {
  const cameraLength = mathjs.unit(beamProperties.cameraLength ?? NaN, "m");
  const clearanceWidth = mathjs.add(
    mathjs.unit(beamstop.clearance ?? NaN, "xpixel"),
    mathjs.divide(beamstop.diameter, 2),
  );
  const clearanceHeight = mathjs.add(
    mathjs.unit(beamstop.clearance ?? NaN, "ypixel"),
    mathjs.divide(beamstop.diameter, 2),
  );

  const beamcentreX = mathjs.unit(beamstop.centre.x ?? NaN, "xpixel");
  const beamcentreY = mathjs.unit(beamstop.centre.y ?? NaN, "ypixel");

  const detectorHeight = mathjs.unit(detector.resolution.height, "ypixel");
  const detectorWidth = mathjs.unit(detector.resolution.width, "xpixel");

  const cameraTubeCentreX = mathjs.unit(cameraTube.centre.x ?? NaN, "xpixel");
  const cemeraTubeCentreY = mathjs.unit(cameraTube.centre.y ?? NaN, "ypixel");

  return {
    clearanceWidth,
    beamcentreX,
    clearanceHeight,
    beamcentreY,
    detectorHeight,
    detectorWidth,
    cameraTubeCentreX,
    cemeraTubeCentreY,
    cameraLength,
  };
}
