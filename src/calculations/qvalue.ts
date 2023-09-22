import { Beamstop } from "../utils/types";
import { Ray } from "./ray";
import { Vector3 } from "three";

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
  qValue: number,
  angle: number,
  cameralength: number,
  wavelength: number,
  beamstop: Beamstop,
): Vector3 => {
  const ray = new Ray(
    new Vector3(Math.cos(angle), Math.sin(angle)),
    new Vector3(beamstop.centre.x ?? 0, beamstop.centre.y ?? 0),
  );
  return ray.getPointAtDistance(
    1.0e3 *
      (calculateDistanceFromQValue(qValue, cameralength, wavelength) ?? 0),
  );
};
