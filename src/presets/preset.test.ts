import { expect, test } from "vitest";
import detectorData from "../presets/detectors.json";
import presetData from "../presets/presetConfigs.json";
import { Detector } from "../utils/types";
import { AppDataFormat } from "./presetManager";

const detectorList = detectorData as Record<string, Detector>;
const presetList = presetData as Record<string, AppDataFormat>;
const defaultConfig = presetList[Object.keys(presetList)[0]];


// Also add some tests for input types



test("Test detectors exist and are valid", () => {
    expect(detectorList).toBeTruthy()
    for (const detector in detectorList) {
        expect(detectorList[detector]).toHaveProperty("resolution.width")
        expect(detectorList[detector]).toHaveProperty("resolution.height")
        expect(detectorList[detector]).toHaveProperty("pixelSize.width")
        expect(detectorList[detector]).toHaveProperty("pixelSize.height")
    }
})

test("Test beamstop and camera tube are valid", () => {
    for (const preset in presetList) {
        expect(presetList[preset]).toHaveProperty("beamstop.diameter")
        expect(presetList[preset]).toHaveProperty("beamstop.centre.x")
        expect(presetList[preset]).toHaveProperty("beamstop.centre.y")
        expect(presetList[preset]).toHaveProperty("beamstop.clearance")
        expect(presetList[preset]).toHaveProperty("cameraTube.centre.x")
        expect(presetList[preset]).toHaveProperty("cameraTube.centre.y")
        expect(presetList[preset]).toHaveProperty("cameraTube.diameter")
    }

})

test("Test presets exist and are valid", () => {
    expect(presetList).toBeTruthy()
    expect(defaultConfig).toBeTruthy()
    for (const preset in presetList) {
        expect(Object.keys(detectorList)).toContain(presetList[preset].detector)
        expect(presetList[preset]).toHaveProperty("angle")
        expect(presetList[preset]).toHaveProperty("wavelength")
        expect(presetList[preset]).toHaveProperty("cameraLength")
        expect(presetList[preset]).toHaveProperty("minWavelength")
        expect(presetList[preset]).toHaveProperty("maxWavelength")
        expect(presetList[preset]).toHaveProperty("minCameraLength")
        expect(presetList[preset]).toHaveProperty("maxCameraLength")
    }
})
