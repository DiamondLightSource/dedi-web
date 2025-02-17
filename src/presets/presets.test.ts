import { expect, test } from "vitest";
import {
  detectorRecord,
  presetConfigRecord,
  calibrantRecord,
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

test("Test beamline presets exist and are valid", () => {
  expect(presetConfigRecord).toBeTruthy();
  for (const preset in presetConfigRecord) {
    expect(presetConfigRecord[preset]).toHaveProperty("detector");

    expect(presetConfigRecord[preset]).toHaveProperty("beamstop.centre.x");
    expect(presetConfigRecord[preset]).toHaveProperty("beamstop.centre.y");
    expect(presetConfigRecord[preset]).toHaveProperty("beamstop.clearance");
    expect(presetConfigRecord[preset]).toHaveProperty("beamstop.diameter");

    expect(presetConfigRecord[preset]).toHaveProperty("wavelengthLimits.min");
    expect(presetConfigRecord[preset]).toHaveProperty("wavelengthLimits.max");

    expect(presetConfigRecord[preset]).toHaveProperty("cameraLengthLimits.min");
    expect(presetConfigRecord[preset]).toHaveProperty("cameraLengthLimits.max");
    expect(presetConfigRecord[preset]).toHaveProperty(
      "cameraLengthLimits.step",
    );

    // optional cemera tube
    if (presetConfigRecord[preset].cameraTube) {
      expect(presetConfigRecord[preset]).toHaveProperty("cameraTube.centre.x");
      expect(presetConfigRecord[preset]).toHaveProperty("cameraTube.centre.y");
      expect(presetConfigRecord[preset]).toHaveProperty("cameraTube.diameter");
    }
  }
});

test("Test calibrants exist and are valid", () => {
  expect(calibrantRecord).toBeTruthy();
  for (const calibrant in calibrantRecord) {
    expect(calibrantRecord[calibrant]).toHaveProperty("d");
  }
});
