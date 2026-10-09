import { expect, test } from "vitest";
import { useDetectorStore } from "./detectorStore";
import { useBeamlineConfigStore } from "./beamlineconfigStore";
import {
  beamlinesUsingDetector,
  createInternalDetector,
  presetConfigRecord,
} from "../presets/presetManager";
import { IOBeamline } from "../utils/types";

const testDetector = createInternalDetector({
  resolution: { width: 100, height: 100 },
  pixelSize: { width: 0.1, height: 0.1 },
});

const firstPreset = Object.values(presetConfigRecord)[0];

function beamlineUsing(detector: string): IOBeamline {
  return { ...firstPreset, detector };
}

// --- beamlinesUsingDetector ---

test("beamlinesUsingDetector lists the beamlines that reference a detector", () => {
  const record = {
    A: beamlineUsing("D1"),
    B: beamlineUsing("D2"),
    C: beamlineUsing("D1"),
  };
  expect(beamlinesUsingDetector("D1", record)).toEqual(["A", "C"]);
  expect(beamlinesUsingDetector("D3", record)).toEqual([]);
});

// --- updateDetector ---

test("updateDetector ignores a name that is not in the detector record", () => {
  const before = useDetectorStore.getState();
  before.updateDetector("No Such Detector");
  const after = useDetectorStore.getState();
  expect(after.name).toBe(before.name);
  expect(after.detector).toBe(before.detector);
  expect(after.detector).toBeDefined();
});

// --- deleteDetector ---

test("deleteDetector refuses to delete a detector that a beamline uses", () => {
  useDetectorStore.getState().addNewDetector("In Use Detector", testDetector);
  useBeamlineConfigStore
    .getState()
    .addNewPreset("Beamline Using It", beamlineUsing("In Use Detector"));

  useDetectorStore.getState().deleteDetector("In Use Detector");

  const state = useDetectorStore.getState();
  expect(state.detectorRecord).toHaveProperty(["In Use Detector"]);
  expect(state.userDetectorRecord).toHaveProperty(["In Use Detector"]);
});

test("deleteDetector removes a user detector that no beamline uses", () => {
  useDetectorStore.getState().addNewDetector("Unused Detector", testDetector);

  useDetectorStore.getState().deleteDetector("Unused Detector");

  const state = useDetectorStore.getState();
  expect(state.detectorRecord).not.toHaveProperty(["Unused Detector"]);
  expect(state.userDetectorRecord).not.toHaveProperty(["Unused Detector"]);
});
