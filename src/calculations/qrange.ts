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
import * as mathjs from "mathjs";

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

  const initialPositionX = mathjs.add(
    mathjs.multiply(clearanceWidth, mathjs.cos(beamProperties.angle)),
    beamcentreX,
  );
  const initialPositionY = mathjs.add(
    mathjs.multiply(clearanceHeight, mathjs.sin(beamProperties.angle)),
    beamcentreY,
  );

  if (typeof initialPositionX === "number" || !("units" in initialPositionX)) {
    return defaultReturn;
  }
  if (typeof initialPositionY === "number" || !("units" in initialPositionY)) {
    return defaultReturn;
  }
  const initialPosition = new Vector2(
    initialPositionX.toSI().toNumber(),
    initialPositionY.toSI().toNumber(),
  );
  // Should now be in SI units

  const ray = new Ray(
    new Vector2(
      mathjs.cos(beamProperties.angle),
      mathjs.sin(beamProperties.angle),
    ),
    initialPosition,
  );

  let t1 = ray.getRectangleIntersectionParameterRange(
    new Vector2(0, detectorHeight.toSI().toNumber()),
    detectorWidth.toSI().toNumber(),
    detectorHeight.toSI().toNumber(),
  );

  if (
    t1 != null &&
    cameraTube != null &&
    cameraTube.diameter.toSI().toNumber() != 0
  ) {
    t1 = t1.intersect(
      ray.getCircleIntersectionParameterRange(
        mathjs.divide(cameraTube.diameter, 2).toSI().toNumber(),
        new Vector2(
          cameraTubeCentreX.toSI().toNumber(),
          cemeraTubeCentreY.toSI().toNumber(),
        ),
      ),
    );
  }
  if (t1 === null) {
    return defaultReturn;
  }

  const ptMin = ray.getPoint(t1.min);
  const ptMax = ray.getPoint(t1.max);

  const detProps: DetectorProperties = {
    ...detector,
    origin: new Vector3(
      beamcentreX.toSI().toNumber(),
      beamcentreY.toSI().toNumber(),
      cameraLength.toSI().toNumber(),
    ),
    beamVector: new Vector3(0, 0, 1),
  };

  const qspace = new QSpace(
    detProps,
    beamProperties.wavelength.toSI().toNumber(),
    2 * Math.PI,
  );

  // get visible range
  const visibleQMin = qspace.qFromPixelPosition(ptMin);
  const visibleQMax = qspace.qFromPixelPosition(ptMax);

  detProps.origin.z = beamProperties.minCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.minWavelength.toSI().toNumber(),
  );
  const fullQMin = qspace.qFromPixelPosition(ptMax);

  detProps.origin.z = beamProperties.maxCameraLength.toSI().toNumber();
  qspace.setDiffractionCrystalEnviroment(
    beamProperties.maxWavelength.toSI().toNumber(),
  );
  const fullQMax = qspace.qFromPixelPosition(ptMin);

  return {
    ptMin: ptMin,
    ptMax: ptMax,
    visibleQRange: new NumericRange(visibleQMin.length(), visibleQMax.length()),
    fullQRange: new NumericRange(fullQMin.length(), fullQMax.length()),
  };
}
