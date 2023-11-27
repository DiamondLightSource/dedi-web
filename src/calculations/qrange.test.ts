import { expect, test } from "vitest";
import { computeQrange } from "./qrange";
import {
  BeamlineConfig,
  Beamstop,
  CircularDevice,
  Detector,
} from "../utils/types";

test("Test computing q ranges", () => {
  const detector: Detector = {
    resolution: {
      height: 1679,
      width: 1475,
    },
    pixelSize: {
      height: 0.172,
      width: 0.172,
    },
  };
  const beamstop: Beamstop = {
    centre: { x: 738, y: 840 },
    diameter: 4,
    clearance: 10,
  };
  const beamConfig: BeamlineConfig = {
    angle: 1.57,
    cameraLength: 1.9,
    minWavelength: 6.2e-2,
    maxWavelength: 0.335,
    minCameraLength: 1.9,
    maxCameraLength: 9.9,
    wavelength: 0.09,
    cameraLengthStep: 1,
  };
  const cameraTube: CircularDevice = {
    centre: { x: 738, y: 840 },
    diameter: 310,
  };

  const { ptMin, ptMax, visibleQRange, fullQRange } = computeQrange(
    detector,
    beamstop,
    cameraTube,
    beamConfig,
  );
  expect(ptMin.y).toBeLessThan(ptMax.y);
  expect(Math.abs(ptMin.x - ptMax.x)).toBeLessThan(1);
  expect(fullQRange).toBeTruthy();
  expect(visibleQRange).toBeTruthy();
});
