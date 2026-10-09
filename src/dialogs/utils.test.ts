import { expect, test } from "vitest";
import { FormUnits } from "./utils";
import detectorSchema from "./detector/schema.json";

// Mask gaps are counted in pixels by computeDeadZones (qrange.ts) and
// SvgMask (centrePlot.tsx), the same unit as the detector resolution.

test("mask gap form units match the resolution units (pixels)", () => {
  expect(FormUnits["mask.horizontalGap"]).toBe(FormUnits["resolution.width"]);
  expect(FormUnits["mask.verticalGap"]).toBe(FormUnits["resolution.height"]);
});

test("mask gaps are whole pixel counts in the detector schema", () => {
  const mask = detectorSchema.properties.mask.properties;
  expect(mask.horizontalGap.type).toBe("integer");
  expect(mask.verticalGap.type).toBe("integer");
});
