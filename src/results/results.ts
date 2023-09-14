import { Vector3 } from "three"
import { BeamlineConfig, Beamstop, CircularDevice, Detector } from "../utils/types"
import { Ray } from "../calculations/ray";
import NumericRange from "../calculations/numericRange";


const computeQRanges = (detector: Detector, beamstop: Beamstop, cameraTube: CircularDevice, beamProperties: BeamlineConfig) => {
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


}