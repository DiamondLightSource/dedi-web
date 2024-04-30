import { expect, test } from "vitest";
import { detectorRecord } from "./presetManager";

test("Test detectors exist anordetectorRecordd are valid", () => {
  expect(detectorRecord).toBeTruthy();
  for (const detector in detectorRecord) {
    expect(detectorRecord[detector]).toHaveProperty("resolution.width");
    expect(detectorRecord[detector]).toHaveProperty("resolution.height");
    expect(detectorRecord[detector]).toHaveProperty("pixelSize.width");
    expect(detectorRecord[detector]).toHaveProperty("pixelSize.height");
  }
});
