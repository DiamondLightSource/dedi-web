import { UnitVector } from "../plot/plotUtils";
import { Ray } from "./ray";
import { Vector2 } from "three";
import * as mathjs from "mathjs";

export const calculateQValue = (
  distance: number,
  cameraLength: number,
  wavelength: number,
): number | null => {
  if (cameraLength === 0 || wavelength == 0) {
    return null;
  }
  if (cameraLength < 0 || distance < 0 || wavelength < 0) {
    return null;
  }
  return (
    (4 * Math.PI * Math.sin(Math.atan(distance / cameraLength) / 2)) /
    wavelength
  );
};

export const calculateDistanceFromQValue = (
  qValue: number,
  cameraLength: number,
  wavelength: number,
): number | null => {
  if (qValue < 0 || cameraLength < 0 || wavelength < 0) {
    return null;
  }
  const temp = (wavelength * qValue) / (4 * Math.PI);
  if (Math.abs(temp) >= Math.sqrt(2) / 2) {
    return null;
  }
  return Math.tan(2 * Math.asin(temp)) * cameraLength;
};

export const getPointForQ = (
  qValue: math.Unit,
  angle: math.Unit,
  cameralength: math.Unit,
  wavelength: math.Unit,
  beamstopCentre: UnitVector,
): UnitVector => {
  const ray = new Ray(
    new Vector2(Math.cos(angle.toSI().toNumber()), Math.sin(angle.toSI().toNumber())),
    new Vector2(beamstopCentre.x.toSI().toNumber(), beamstopCentre.y.toSI().toNumber()),
  );
  const result = ray.getPointAtDistance(
    (calculateDistanceFromQValue(qValue.toSI().toNumber(), cameralength.toSI().toNumber(), wavelength.toSI().toNumber())) ?? 0,
  );
  return { x: mathjs.unit(result.x, "m"), y: mathjs.unit(result.y, "m") }
};
