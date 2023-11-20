import QSpace, { DetectorProperties } from "../calculations/qspace";
import {
  BeamlineConfig,
  Beamstop,
  CircularDevice,
  Detector,
} from "../utils/types";
import { Vector2, Vector3 } from "three";
import { Ray } from "../calculations/ray";
import NumericRange from "./numericRange";

/**
 * Compute the viable and full qranges
 * @param detector Detector object with data on how the detector e
 * @param beamstop
 * @param cameraTube
 * @param beamProperties
 * @returns
 */
export function computeQrange(
  detector: Detector,
  beamstop: Beamstop,
  cameraTube: CircularDevice,
  beamProperties: BeamlineConfig,
): {
  ptMin: Vector2;
  ptMax: Vector2;
  visibleQRange: NumericRange | null;
  fullQRange: NumericRange | null;
} {
  // convert pixel values to mm

  const defaultReturn = {
    ptMin: new Vector2(0, 0),
    ptMax: new Vector2(0, 0),
    visibleQRange: null,
    fullQRange: null,
  };
  const clearanceWidthMM =
    (beamstop.clearance ?? 0) * detector.pixelSize.width +
    beamstop.diameter / 2;
  const clearaceHeightMM =
    (beamstop.clearance ?? 0) * detector.pixelSize.height +
    beamstop.diameter / 2;

  const beamcentreXMM = (beamstop.centre.x ?? 0) * detector.pixelSize.width;
  const beamcentreYMM = (beamstop.centre.y ?? 0) * detector.pixelSize.height;

  const detectorHeightMM =
    detector.resolution.height * detector.pixelSize.height;
  const detectorWidthMM = detector.resolution.width * detector.pixelSize.width;

  const cameraTubeCentreXMM =
    (cameraTube.centre.x ?? 0) * detector.pixelSize.width;
  const cemeraTubeCentreYMM =
    (cameraTube.centre.y ?? 0) * detector.pixelSize.height;

  const initialPosition = new Vector2(
    clearanceWidthMM * Math.cos(beamProperties.angle ?? 0) + beamcentreXMM,
    clearaceHeightMM * Math.sin(beamProperties.angle ?? 0) + beamcentreYMM,
  );

  const ray = new Ray(
    new Vector2(
      Math.cos(beamProperties.angle ?? 0),
      Math.sin(beamProperties.angle ?? 0),
    ),
    initialPosition,
  );
  let t1 = ray.getRectangleIntersectionParameterRange(
    new Vector2(0, detectorHeightMM),
    detectorWidthMM,
    detectorHeightMM,
  );

  if (t1 != null && cameraTube != null && cameraTube.diameter != 0) {
    t1 = t1.intersect(
      ray.getCircleIntersectionParameterRange(
        (cameraTube.diameter ?? 0) / 2,
        new Vector2(cameraTubeCentreXMM, cemeraTubeCentreYMM),
      ),
    );
  }
  if (
    t1 === null ||
    beamProperties.wavelength == null ||
    beamProperties.cameraLength == null
  ) {
    return defaultReturn;
  }

  const ptMin = ray.getPoint(t1.min);
  const ptMax = ray.getPoint(t1.max);

  const detProps: DetectorProperties = {
    ...detector,
    origin: new Vector3(
      beamcentreXMM,
      beamcentreYMM,
      beamProperties.cameraLength * 1e3,
    ),
    beamVector: new Vector3(0, 0, 1),
  };

  const qspace = new QSpace(
    detProps,
    beamProperties.wavelength * 1e10,
    2 * Math.PI,
  );

  // get visible range
  const visibleQMin = qspace.qFromPixelPosition(ptMin);
  const visibleQMax = qspace.qFromPixelPosition(ptMax);

  detProps.origin.z = beamProperties.minCameraLength * 1e3;
  qspace.setDiffractionCrystalEnviroment(beamProperties.minWavelength * 1e10);
  const fullQMin = qspace.qFromPixelPosition(ptMax);

  detProps.origin.z = beamProperties.maxCameraLength * 1e3;
  qspace.setDiffractionCrystalEnviroment(beamProperties.maxWavelength * 1e10);
  const fullQMax = qspace.qFromPixelPosition(ptMin);
  return {
    ptMin: ptMin,
    ptMax: ptMax,
    visibleQRange: new NumericRange(
      visibleQMin.length() * 1e10,
      visibleQMax.length() * 1e10,
    ),
    fullQRange: new NumericRange(
      fullQMin.length() * 1e10,
      fullQMax.length() * 1e10,
    ),
  };
}
