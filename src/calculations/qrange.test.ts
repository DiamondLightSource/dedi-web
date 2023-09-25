import { test } from "vitest";
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
      width: 1465,
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
    minCameraLength: 0,
    maxCameraLength: 4,
    wavelength: 9e-2,
  };
  const cameraTube: CircularDevice = {
    centre: { x: 738, y: 840 },
    diameter: 310,
  };

  const result = computeQrange(detector, beamstop, cameraTube, beamConfig);
  console.log(result);
});
