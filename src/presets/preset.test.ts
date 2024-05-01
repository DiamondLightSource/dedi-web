import { expect, test } from "vitest";
import { 
  beamlineRecord,
  detectorRecord,
  presetConfigRecord
} from "./presetManager";

test("Test detectors exist detectors are valid", () => {
  expect(detectorRecord).toBeTruthy();
  for (const detector in detectorRecord) {
    expect(detectorRecord[detector]).toHaveProperty("resolution.width");
    expect(detectorRecord[detector]).toHaveProperty("resolution.height");
    expect(detectorRecord[detector]).toHaveProperty("pixelSize.width");
    expect(detectorRecord[detector]).toHaveProperty("pixelSize.height");
  }
});

test("Test beamlines exist and are valid", () => {
  expect(beamlineRecord).toBeTruthy();
  for (const beamline in beamlineRecord) {
    expect(beamlineRecord[beamline]).toHaveProperty("minWavelength");
    expect(beamlineRecord[beamline]).toHaveProperty("maxWavelength");
    expect(beamlineRecord[beamline]).toHaveProperty("minCameraLength");
    expect(beamlineRecord[beamline]).toHaveProperty("maxCameraLength");
    expect(beamlineRecord[beamline]).toHaveProperty("cameraLengthStep");
  }
});

test("Test that app presets are valid", () => {
  expect(presetConfigRecord).toBeTruthy();
  for (const config in presetConfigRecord) {
    expect(Object.keys(detectorRecord))
      .toContain(presetConfigRecord[config].detector);
    expect(Object.keys(beamlineRecord))
      .toContain(presetConfigRecord[config].beamline);
    expect(presetConfigRecord[config]).toHaveProperty("beamstop.diameter");
    expect(presetConfigRecord[config]).toHaveProperty("beamstop.centre.x");
    expect(presetConfigRecord[config]).toHaveProperty("beamstop.centre.y");
    expect(presetConfigRecord[config]).toHaveProperty("beamstop.clearance");
    expect(presetConfigRecord[config]).toHaveProperty("cameraTube.centre.x");
    expect(presetConfigRecord[config]).toHaveProperty("cameraTube.centre.y");
    expect(presetConfigRecord[config]).toHaveProperty("cameraTube.diameter");
  }
});
