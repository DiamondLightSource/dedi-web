import { UnitVector } from "../calculations/unitVector";
import { convertFromDtoQ } from "../results/scatteringQuantities";
import { AppCalibrant, Calibrant } from "../utils/types";
import { unit, Unit } from "mathjs";
import { getPointForQ } from "./qvalue";

export function createRings(calibrant: Calibrant): AppCalibrant {
  const finalPosition = Math.max(...calibrant.d);
  return {
    finalPosition: finalPosition,
    fractions: calibrant.d.map((position: number) => position / finalPosition),
  };
}

export function createLargestRing(
  d: number,
  angle: Unit,
  cameraLength: Unit,
  wavelength: Unit,
  beamstopCentre: UnitVector,
): UnitVector {
  const q = convertFromDtoQ(unit(d, "m"));
  return getPointForQ(q, angle, cameraLength, wavelength, beamstopCentre);
}
