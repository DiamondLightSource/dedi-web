import * as mathjs from "mathjs";
import { Vector2, Vector3 } from "three";
import QSpace from "../calculations/qspace";
import { Ray } from "../calculations/ray";
import {
  AppBeamstop,
  AppCircularDevice,
  AppDetector,
  AppBeamline,
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

/**
 * Computes the q-range for a given detector, beamstop, camera tube, and beamline properties.
 *
 * The calculation proceeds in three stages:
 *   1. Geometry — fire a ray from the beamstop shadow edge and intersect it
 *      with the detector rectangle and optional camera tube circle to find the
 *      accessible pixel range [minPoint, maxPoint].
 *   2. Visible q-range — convert those pixel positions to |q| using the
 *      current camera length and wavelength:  q = 4π·sin(θ)/λ,  tan(2θ) = r/L.
 *   3. Full q-range — the extremes achievable across all valid (L, λ) settings:
 *      - max q  →  shortest L,  shortest λ,  far detector edge (maxPoint)
 *      - min q  →  longest  L,  longest  λ,  near beamstop edge (minPoint)
 */
export function computeQrange(
  detector: AppDetector,
  beamstop: AppBeamstop,
  beamline: AppBeamline,
  cameraTube?: AppCircularDevice,
): {
  minPoint: Vector2;
  maxPoint: Vector2;
  visibleQRange: NumericRange | null;
  fullQRange: NumericRange | null;
} {
  const { clearance, centre, detectorSize, cameraLength } = convertToSIUnits(
    beamline,
    beamstop,
    detector,
  );

  // Ray direction from the beamline angle
  const direction = new Vector2(
    mathjs.cos(beamline.angle),
    mathjs.sin(beamline.angle),
  );

  // Ray starts at the edge of the beamstop clearance circle
  const initial = clearance.multiply(direction).add(centre).toSI().toVector2();
  const ray = new Ray(direction, initial);

  // Find where the ray exits the detector rectangle
  const topLeft = new Vector2(0, detectorSize.y.toSI().toNumber());
  const detectorRange = ray.getRectangleIntersectionRange(
    topLeft,
    detectorSize.toSI().toVector2(),
  );
  if (!detectorRange) {
    console.warn(formatLogMessage("Ray does not intersect detector"));
    return defaultReturn;
  }

  // Intersect with the camera tube circle when present
  let intersection = detectorRange;
  if (cameraTube && cameraTube.diameter.toSI().toNumber() !== 0) {
    const tubeCentre = new UnitVector(
      mathjs.unit(cameraTube.centre.x ?? NaN, "xpixel"),
      mathjs.unit(cameraTube.centre.y ?? NaN, "ypixel"),
    ).toSI().toVector2();
    const tubeRadius = mathjs.divide(cameraTube.diameter, 2).toSI().toNumber();
    const cameraIntersection = detectorRange.intersect(
      ray.getCircleIntersectionRange(tubeRadius, tubeCentre),
    );
    if (!cameraIntersection) {
      console.warn(
        formatLogMessage("No intersection between Ray, Camera Tube, and Detector"),
      );
      return defaultReturn;
    }
    intersection = cameraIntersection;
  }

  // Accessible pixel positions along the scatter direction
  const minPoint = ray.getPoint(intersection.min); // near beamstop edge
  const maxPoint = ray.getPoint(intersection.max); // far detector edge

  // Helper: create a QSpace for a specific (cameraLength, wavelength) pair
  const makeQSpace = (camLen: mathjs.Unit, wavelength: mathjs.Unit) =>
    new QSpace(
      {
        origin: centre.toSI().toVector3(camLen.toSI().toNumber()),
        beamVector: new Vector3(0, 0, 1),
      },
      wavelength.toSI().toNumber(),
    );

  // Visible q-range: current instrument settings
  const qspaceVisible = makeQSpace(cameraLength, beamline.wavelength);
  const visibleQRange = new NumericRange(
    qspaceVisible.qFromPixelPosition(minPoint).length(),
    qspaceVisible.qFromPixelPosition(maxPoint).length(),
  );

  // Full q-range: evaluate at the two extreme (L, λ) corners.
  // NumericRange auto-sorts, so the order of arguments does not matter.
  // max q corner — short camera, short wavelength, far pixel
  const qAtShortCam = makeQSpace(
    beamline.cameraLimits.min,
    beamline.wavelengthLimits.min,
  ).qFromPixelPosition(maxPoint);
  // min q corner — long camera, long wavelength, near pixel
  const qAtLongCam = makeQSpace(
    beamline.cameraLimits.max,
    beamline.wavelengthLimits.max,
  ).qFromPixelPosition(minPoint);
  const fullQRange = new NumericRange(qAtShortCam.length(), qAtLongCam.length());

  console.info(formatLogMessage(`Visible q range: ${visibleQRange.toString()}`));
  console.info(formatLogMessage(`Full q range: ${fullQRange.toString()}`));

  return { minPoint, maxPoint, visibleQRange, fullQRange };
}

/**
 * Converts beamline/beamstop/detector app values into SI units ready for
 * the q-range calculation.
 */
function convertToSIUnits(
  beamline: AppBeamline,
  beamstop: AppBeamstop,
  detector: AppDetector,
): {
  clearance: UnitVector;
  centre: UnitVector;
  detectorSize: UnitVector;
  cameraLength: mathjs.Unit;
} {
  const cameraLength = mathjs.unit(beamline.cameraLength ?? NaN, "m");
  const beamstopRadius = mathjs.divide(beamstop.diameter, 2);
  const clearance = new UnitVector(
    mathjs.unit(beamstop.clearance ?? NaN, "xpixel"),
    mathjs.unit(beamstop.clearance ?? NaN, "ypixel"),
  ).add(new UnitVector(beamstopRadius, beamstopRadius));
  const centre = new UnitVector(
    mathjs.unit(beamstop.centre.x ?? NaN, "xpixel"),
    mathjs.unit(beamstop.centre.y ?? NaN, "ypixel"),
  );
  const detectorSize = new UnitVector(
    mathjs.unit(detector.resolution.width, "xpixel"),
    mathjs.unit(detector.resolution.height, "ypixel"),
  );
  return { clearance, centre, detectorSize, cameraLength };
}
