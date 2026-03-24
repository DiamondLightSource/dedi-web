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
  accessibleQRanges: [] as NumericRange[],
  accessibleSegments: [] as [number, number][],
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
  accessibleQRanges: NumericRange[];
  /** Position fractions [t0, t1] along the visible range line for each
   * accessible sub-range. Derived from the ray t-parameter (linear in
   * detector position) — not from q-values — so gaps align correctly
   * with dead zones regardless of scattering angle. */
  accessibleSegments: [number, number][];
} {
  const { clearance, centre, detectorSize, cameraLength, pixelSizeX, pixelSizeY } = convertToSIUnits(
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

  // Accessible q-sub-ranges — the visible range with mask dead zones subtracted.
  // Each dead zone rectangle is intersected with the ray; blocked t-intervals
  // are subtracted from the full intersection range.
  //
  // accessibleSegments uses raw t-fractions (linear in detector position) so
  // that SVG line gaps align exactly with dead zones at any scattering angle.
  // accessibleQRanges converts the same t-ranges to q-values for the diagram.
  const deadZones = computeDeadZones(detector, pixelSizeX, pixelSizeY);
  const blockedTRanges = deadZones
    .map(({ topLeft, dimensions }) =>
      ray.getRectangleIntersectionRange(topLeft, dimensions),
    )
    .filter((r): r is NumericRange => r !== null)
    .map((r) => intersection.intersect(r))
    .filter((r): r is NumericRange => r !== null);
  const accessibleTRanges = subtractIntervals(intersection, blockedTRanges);
  const tSpan = intersection.max - intersection.min;
  const accessibleSegments: [number, number][] = accessibleTRanges.map(
    (r): [number, number] => [
      (r.min - intersection.min) / tSpan,
      (r.max - intersection.min) / tSpan,
    ],
  );
  const accessibleQRanges = accessibleTRanges.map(
    (tRange) =>
      new NumericRange(
        qspaceVisible.qFromPixelPosition(ray.getPoint(tRange.min)).length(),
        qspaceVisible.qFromPixelPosition(ray.getPoint(tRange.max)).length(),
      ),
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

  return { minPoint, maxPoint, visibleQRange, fullQRange, accessibleQRanges, accessibleSegments };
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
  pixelSizeX: number;
  pixelSizeY: number;
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
  const pixelSizeX = detectorSize.x.toSI().toNumber() / detector.resolution.width;
  const pixelSizeY = detectorSize.y.toSI().toNumber() / detector.resolution.height;
  return { clearance, centre, detectorSize, cameraLength, pixelSizeX, pixelSizeY };
}

/**
 * Returns an axis-aligned bounding box for each dead pixel region of the
 * detector mask, expressed in SI metres in the same coordinate system as the
 * scatter ray (x right, y downward, origin at detector top-left — matching
 * image/screen coordinates where pixel row 0 is at the top).
 *
 * Each bounding box is expressed as the pair (topLeft, dimensions) where
 * topLeft.y is the BOTTOM edge of the zone (maximum y, since y increases
 * downward), matching the convention of getRectangleIntersectionRange.
 *
 * Three types of dead region are enumerated:
 *   - Vertical gap strips between column modules (nH − 1 of them)
 *   - Horizontal gap strips between row modules  (nV − 1 of them)
 *   - Missing modules referenced by row-major index
 */
function computeDeadZones(
  detector: AppDetector,
  pixelSizeX: number,
  pixelSizeY: number,
): { topLeft: Vector2; dimensions: Vector2 }[] {
  if (!detector.mask) return [];

  const { horizontalModules: nH, verticalModules: nV, horizontalGap: gx, verticalGap: gy, missingModules } = detector.mask;
  const W = detector.resolution.width;
  const H = detector.resolution.height;

  // Module dimensions in pixels (gaps are not part of a module)
  const mW = (W - (nH - 1) * gx) / nH;
  const mH = (H - (nV - 1) * gy) / nV;

  // Convert a pixel-space rectangle (col, row from top-left, y increases
  // downward) to the SI bounding box expected by getRectangleIntersectionRange.
  // topLeft.y is the MAXIMUM y in that function (i.e. the bottom edge of the
  // zone in screen/image space, since y increases downward).
  const toZone = (colPx: number, rowPx: number, wPx: number, hPx: number) => ({
    topLeft: new Vector2(colPx * pixelSizeX, (rowPx + hPx) * pixelSizeY),
    dimensions: new Vector2(wPx * pixelSizeX, hPx * pixelSizeY),
  });

  const zones: { topLeft: Vector2; dimensions: Vector2 }[] = [];

  // Vertical gap strips — one per inter-column boundary
  for (let i = 0; i < nH - 1; i++) {
    zones.push(toZone((i + 1) * mW + i * gx, 0, gx, H));
  }

  // Horizontal gap strips — one per inter-row boundary
  for (let j = 0; j < nV - 1; j++) {
    zones.push(toZone(0, (j + 1) * mH + j * gy, W, gy));
  }

  // Missing modules — row-major index k → (row, col)
  for (const k of missingModules ?? []) {
    const row = Math.floor(k / nH);
    const col = k % nH;
    zones.push(toZone(col * (mW + gx), row * (mH + gy), mW, mH));
  }

  return zones;
}

/**
 * Subtracts a set of blocked intervals from a full range, returning
 * the remaining accessible sub-intervals in ascending order.
 */
function subtractIntervals(
  full: NumericRange,
  blocked: NumericRange[],
): NumericRange[] {
  const sorted = blocked
    .filter((b) => b.max > full.min && b.min < full.max)
    .map((b) => new NumericRange(Math.max(b.min, full.min), Math.min(b.max, full.max)))
    .sort((a, b) => a.min - b.min);

  const result: NumericRange[] = [];
  let cursor = full.min;

  for (const interval of sorted) {
    if (interval.min > cursor) {
      result.push(new NumericRange(cursor, interval.min));
    }
    cursor = Math.max(cursor, interval.max);
  }

  if (cursor < full.max) {
    result.push(new NumericRange(cursor, full.max));
  }

  return result;
}
