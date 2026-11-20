import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  loadUserBeamlines,
  loadUserCalibrants,
  loadUserDetectors,
} from "./persistedStorage";

let store: Record<string, string>;

beforeEach(() => {
  store = {};
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
  });
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const validDetector = {
  resolution: { width: 100, height: 200 },
  pixelSize: { width: 0.172, height: 0.172 },
  mask: {
    horizontalModules: 1,
    verticalModules: 2,
    horizontalGap: 0,
    verticalGap: 10,
    missingModules: [],
  },
};

const validBeamline = {
  detector: "Pilatus P3-2M",
  beamstop: { centre: { x: 700, y: 50 }, diameter: 4, clearance: 10 },
  cameraTube: { centre: { x: 700, y: 800 }, diameter: 310 },
  wavelengthLimits: { min: 0.062, max: 0.24 },
  cameraLengthLimits: { min: 1.9, max: 9.9, step: 0.25 },
};

// --- whole-record problems ---

test("loadUserDetectors returns {} when the stored value is not valid JSON", () => {
  store["dedi-user-detectors"] = "{not json";
  expect(loadUserDetectors()).toEqual({});
});

test("loadUserDetectors returns {} when the stored JSON is not an object", () => {
  store["dedi-user-detectors"] = "[1, 2, 3]";
  expect(loadUserDetectors()).toEqual({});
});

// --- detectors ---

test("loadUserDetectors keeps valid detectors and drops malformed ones", () => {
  store["dedi-user-detectors"] = JSON.stringify({
    Good: validDetector,
    NoPixelSize: { resolution: { width: 100, height: 100 } },
    ZeroWidth: { ...validDetector, resolution: { width: 0, height: 100 } },
    BadMask: {
      ...validDetector,
      mask: { ...validDetector.mask, horizontalModules: 0 },
    },
  });
  expect(Object.keys(loadUserDetectors())).toEqual(["Good"]);
  expect(console.warn).toHaveBeenCalled();
});

test("loadUserDetectors accepts a detector without a mask", () => {
  const noMask = { ...validDetector, mask: undefined }; // dropped by JSON
  store["dedi-user-detectors"] = JSON.stringify({ NoMask: noMask });
  expect(Object.keys(loadUserDetectors())).toEqual(["NoMask"]);
});

// --- beamlines ---

test("loadUserBeamlines keeps valid beamlines and drops malformed ones", () => {
  store["dedi-user-beamlines"] = JSON.stringify({
    Good: validBeamline,
    NoDetector: { ...validBeamline, detector: undefined },
    NoBeamstop: { ...validBeamline, beamstop: undefined },
    ZeroStep: {
      ...validBeamline,
      cameraLengthLimits: { min: 1, max: 2, step: 0 },
    },
  });
  expect(Object.keys(loadUserBeamlines())).toEqual(["Good"]);
});

test("loadUserBeamlines accepts a beamline without a camera tube", () => {
  const noTube = { ...validBeamline, cameraTube: undefined }; // dropped by JSON
  store["dedi-user-beamlines"] = JSON.stringify({ NoTube: noTube });
  expect(Object.keys(loadUserBeamlines())).toEqual(["NoTube"]);
});

// --- calibrants ---

test("loadUserCalibrants keeps valid calibrants and drops malformed ones", () => {
  store["dedi-user-calibrants"] = JSON.stringify({
    Good: { d: [0.5, 0.25] },
    Empty: { d: [] },
    Negative: { d: [0.5, -1] },
    NotArray: { d: "0.5" },
  });
  expect(Object.keys(loadUserCalibrants())).toEqual(["Good"]);
});
