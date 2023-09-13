import { Vector3 } from "three"
import { BeamlineConfig, Beamstop, CircularDevice, Detector } from "../utils/types"
import { Ray } from "../calculations/ray";


const computeQRanges = (detector: Detector, beamstop: Beamstop, cameraTube: CircularDevice, beamProperties: BeamlineConfig) => {
    const initialPosition = new Vector3(beamstop.clearance ?? 0 * Math.cos(beamProperties.angle ?? 0) + (beamstop.centre.y ?? 0),
        beamstop.clearance ?? 0 * Math.sin(beamProperties.angle ?? 0) + (beamstop.centre.y ?? 0))

    const ray = new Ray(new Vector3(Math.cos(beamProperties.angle ?? 0), Math.sin(beamProperties.angle ?? 0)), initialPosition);
    NumericRange t1 = ray.getRectangleIntersectionParameterRange(new Vector2d(0, detector.)


}