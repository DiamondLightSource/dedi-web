import { create } from "zustand";
import { AngleUnits, WavelengthUnits } from "../utils/units";
import QSpace, { DetectorProperties, DiffractionCrystalEnvironment } from "../calculations/qspace";
import NumericRange from "../calculations/numericRange";
import { BeamlineConfig, Beamstop, CircularDevice, Detector } from "../utils/types";
import { Vector2, Vector3, Vector4 } from "three";
import { Ray } from "../calculations/ray";

interface ScatteringQuantity {
    name: string,
    minValue: number,
    maxValue: number,
    RequestedMin: number,
    RequestedMax: number,
}

export interface ResultStore {
    selected: string,
    q: ScatteringQuantity,
    qUnits: WavelengthUnits,
    qspace: QSpace
    twoTheta: ScatteringQuantity
    thetaUnits: AngleUnits
    visableQRange: NumericRange
    fullQRange: NumericRange
}

function computeQrange(detector: Detector, beamstop: Beamstop, cameraTube: CircularDevice, beamProperties: BeamlineConfig) {
    const initialPosition = new Vector3(beamstop.clearance ?? 0 * Math.cos(beamProperties.angle ?? 0) + (beamstop.centre.y ?? 0),
        beamstop.clearance ?? 0 * Math.sin(beamProperties.angle ?? 0) + (beamstop.centre.y ?? 0))

    const ray = new Ray(new Vector3(Math.cos(beamProperties.angle ?? 0), Math.sin(beamProperties.angle ?? 0)), initialPosition);
    let t1 = ray.getRectangleIntersectionParameterRange(new Vector3(0, detector.resolution.height), detector.resolution.width, detector.resolution.height)

    if (t1 != null && cameraTube != null && cameraTube.diameter != 0) {
        t1 = t1.intersect(ray.getCircleIntersectionParameterRange((cameraTube.diameter ?? 0) / 2, new Vector3(cameraTube.centre.x ?? 0, cameraTube.centre.y ?? 0)));
    }

    if (t1 === null || beamProperties.wavelength == null || beamProperties.cameraLength == null) {
        return null
    }

    const ptMin = ray.getPoint(t1.min);
    const ptMax = ray.getPoint(t1.max);

    const detProps: DetectorProperties = {
        ...detector,
        origin: new Vector3(beamstop.centre.x ?? 0, beamstop.centre.y ?? 0, beamProperties.cameraLength * 1e-3),
        beamVector: new Vector3(0, 0, 1)
    }

    const diffCrystEnv: DiffractionCrystalEnvironment = {
        wavelength: beamProperties.wavelength * 1e10,
        referenceNormal: new Vector3(0, 1, 0),
        strokesVector: new Vector4(1, 1, 0, 0)
    }

    const qspace = new QSpace(detProps, diffCrystEnv, 2 * Math.PI)

    // get visible range
    const visibleQmin = qspace.qFromPixelPosition(ptMin.x / detector.pixelSize.width, ptMin.y / detector.pixelSize.height)
    const visibleQmax = qspace.qFromPixelPosition(ptMax.x / detector.pixelSize.width, ptMax.y / detector.pixelSize.height)


    detProps.origin.z = beamProperties.minCameraLength * 1e3
    qspace.setDiffractionCrystalEnviroment({ ...diffCrystEnv, wavelength: beamProperties.minCameraLength * 1e10 })
    const fullQMin = qspace.qFromPixelPosition(ptMin.x / detector.pixelSize.width, ptMin.y / detector.pixelSize.height)

    detProps.origin.z = beamProperties.maxCameraLength * 1e3
    qspace.setDiffractionCrystalEnviroment({ ...diffCrystEnv, wavelength: beamProperties.maxCameraLength * 1e10 })
    const fullQMax = qspace.qFromPixelPosition(ptMax.x / detector.pixelSize.width, ptMax.y / detector.pixelSize.height)

    return { visibleQmin: visibleQmin, visibleQmax: visibleQmax, fullQMax, fullQMin }

}



