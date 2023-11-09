import { expect, test } from "vitest";
import { defaultConfig, detectorList, presetList } from "./presetManager";

test("Test detectors exist and are valid", () => {
  expect(detectorList).toBeTruthy();
  for (const detector in detectorList) {
    expect(detectorList[detector]).toHaveProperty("resolution.width");
    expect(detectorList[detector]).toHaveProperty("resolution.height");
    expect(detectorList[detector]).toHaveProperty("pixelSize.width");
    expect(detectorList[detector]).toHaveProperty("pixelSize.height");
  }
});

test("Test beamstop and camera tube are valid", () => {
  for (const preset in presetList) {
    expect(presetList[preset]).toHaveProperty("beamstop.diameter");
    expect(presetList[preset]).toHaveProperty("beamstop.centre.x");
    expect(presetList[preset]).toHaveProperty("beamstop.centre.y");
    expect(presetList[preset]).toHaveProperty("beamstop.clearance");
    expect(presetList[preset]).toHaveProperty("cameraTube.centre.x");
    expect(presetList[preset]).toHaveProperty("cameraTube.centre.y");
    expect(presetList[preset]).toHaveProperty("cameraTube.diameter");
  }
});

test("Test presets exist and are valid", () => {
  expect(presetList).toBeTruthy();
  expect(defaultConfig).toBeTruthy();
  for (const preset in presetList) {
    expect(Object.keys(detectorList)).toContain(presetList[preset].detector);
    expect(presetList[preset]).toHaveProperty("angle");
    expect(presetList[preset]).toHaveProperty("cameraLength");
    expect(presetList[preset]).toHaveProperty("minWavelength");
    expect(presetList[preset]).toHaveProperty("maxWavelength");
    expect(presetList[preset]).toHaveProperty("minCameraLength");
    expect(presetList[preset]).toHaveProperty("maxCameraLength");
  }
});
