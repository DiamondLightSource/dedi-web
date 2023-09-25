import QSpace, {
    DetectorProperties,
    DiffractionCrystalEnvironment,
} from "../calculations/qspace";
import {
    BeamlineConfig,
    Beamstop,
    CircularDevice,
    Detector,
} from "../utils/types";
import { Vector2, Vector3, Vector4 } from "three";
import { Ray } from "../calculations/ray";
import NumericRange from "./numericRange";
/**
 * Compute the viable and full qranges
 * @param detector
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
    visibleQRange: NumericRange;
    fullQRange: NumericRange;
} | null {
    // convert pixel values to mm
    const clearanceWidthMM = (beamstop.clearance ?? 0) * detector.pixelSize.width;
    const clearaceHeightMM =
        (beamstop.clearance ?? 0) * detector.pixelSize.height;

    const beamcentreXMM = (beamstop.centre.x ?? 0) * detector.pixelSize.width;
    const beamcentreYMM = (beamstop.centre.y ?? 0) * detector.pixelSize.height;

    const detectorHeightMM =
        detector.resolution.height * detector.pixelSize.height;
    const detectorWidthMM = detector.resolution.width * detector.pixelSize.width;

    const cameraTubeCentreXMM =
        (cameraTube.centre.x ?? 0) * detector.pixelSize.width;
    const cemeraTubeCentreYMM =
        (cameraTube.centre.y ?? 0) * detector.pixelSize.height;

    // intial position is wrong
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
        return null;
    }

    const ptMin = ray.getPoint(t1.min);
    const ptMax = ray.getPoint(t1.max);

    const detProps: DetectorProperties = {
        ...detector,
        origin: new Vector3(
            beamcentreXMM,
            beamcentreYMM,
            beamProperties.cameraLength * 1e-3,
        ),
        beamVector: new Vector3(0, 0, 1),
    };

    const diffCrystEnv: DiffractionCrystalEnvironment = {
        wavelength: beamProperties.wavelength * 1e10,
        referenceNormal: new Vector3(0, 1, 0),
        strokesVector: new Vector4(1, 1, 0, 0),
    };

    const qspace = new QSpace(detProps, diffCrystEnv, 2 * Math.PI);

    // get visible range
    const visibleQMin = qspace.qFromPixelPosition(
        ptMin.x / detector.pixelSize.width,
        ptMin.y / detector.pixelSize.height,
    );
    const visibleQMax = qspace.qFromPixelPosition(
        ptMax.x / detector.pixelSize.width,
        ptMax.y / detector.pixelSize.height,
    );

    detProps.origin.z = beamProperties.minCameraLength * 1e3;
    qspace.setDiffractionCrystalEnviroment({
        ...diffCrystEnv,
        wavelength: beamProperties.minCameraLength * 1e10,
    });
    const fullQMin = qspace.qFromPixelPosition(
        ptMin.x / detector.pixelSize.width,
        ptMin.y / detector.pixelSize.height,
    );

    detProps.origin.z = beamProperties.maxCameraLength * 1e3;
    qspace.setDiffractionCrystalEnviroment({
        ...diffCrystEnv,
        wavelength: beamProperties.maxCameraLength * 1e10,
    });
    const fullQMax = qspace.qFromPixelPosition(
        ptMax.x / detector.pixelSize.width,
        ptMax.y / detector.pixelSize.height,
    );

    return {
        ptMin: ptMin,
        ptMax: ptMax,
        visibleQRange: new NumericRange(visibleQMin.x, visibleQMax.x),
        fullQRange: new NumericRange(fullQMin.x, fullQMax.x),
    };
}
