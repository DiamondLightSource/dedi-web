import { unit } from "mathjs";
import { Vector2 } from "three";
import { UnitVector } from "../plot/plotUtils";
import { Ray } from "./ray";

export const calculateQValue = (
  distance: number,
  cameraLength: number,
  wavelength: number
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
  wavelength: number
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

/**
 *  conver into numbers then get result
 * @param qValue
 * @param angle
 * @param cameralength
 * @param wavelength
 * @param beamstopCentre
 * @returns
 */
export const getPointForQ = (
  qValue: math.Unit,
  angle: math.Unit,
  cameralength: math.Unit,
  wavelength: math.Unit,
  beamstopCentre: UnitVector
): UnitVector => {
  const [q, c, v, a, beamX, beamY] = [
    qValue,
    cameralength,
    wavelength,
    angle,
    beamstopCentre.x,
    beamstopCentre.y,
  ].map((i) => i.toSI().toNumber());
  const ray = new Ray(
    new Vector2(Math.cos(a), Math.sin(a)),
    new Vector2(beamX, beamY)
  );

  const distance = calculateDistanceFromQValue(q, c, v) ?? 0;

  const result = ray.getPointAtDistance(distance);
  const x = unit(result.x, "m");
  const y = unit(result.y, "m");
  return { x, y };
};
