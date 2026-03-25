import { expect, test } from "vitest";
import {
  detectorRecord,
  presetConfigRecord,
  calibrantRecord,
} from "./presetManager";

test.each(Object.entries(detectorRecord))(
  "detector '%s' has valid resolution and pixel size",
  (_, detector) => {
    expect(detector.resolution.width).toBeGreaterThan(0);
    expect(detector.resolution.height).toBeGreaterThan(0);
    expect(detector.pixelSize.width.toNumber("mm")).toBeGreaterThan(0);
    expect(detector.pixelSize.height.toNumber("mm")).toBeGreaterThan(0);
  },
);

test.each(Object.entries(presetConfigRecord))(
  "beamline preset '%s' references a known detector",
  (_, preset) => {
    expect(detectorRecord).toHaveProperty(preset.detector);
  },
);

test.each(Object.entries(presetConfigRecord))(
  "beamline preset '%s' has valid wavelength limits",
  (_, preset) => {
    expect(preset.wavelengthLimits.min).toBeGreaterThan(0);
    expect(preset.wavelengthLimits.max).toBeGreaterThan(0);
    expect(preset.wavelengthLimits.min).toBeLessThan(
      preset.wavelengthLimits.max,
    );
  },
);

test.each(Object.entries(presetConfigRecord))(
  "beamline preset '%s' has valid camera length limits",
  (_, preset) => {
    expect(preset.cameraLengthLimits.min).toBeGreaterThan(0);
    expect(preset.cameraLengthLimits.max).toBeGreaterThan(0);
    expect(preset.cameraLengthLimits.step).toBeGreaterThan(0);
    expect(preset.cameraLengthLimits.min).toBeLessThan(
      preset.cameraLengthLimits.max,
    );
  },
);

test.each(Object.entries(presetConfigRecord))(
  "beamline preset '%s' has a valid beamstop",
  (_, preset) => {
    expect(preset.beamstop.diameter).toBeGreaterThan(0);
  },
);

test.each(Object.entries(calibrantRecord))(
  "calibrant '%s' has a non-empty d-spacing array with positive values",
  (_, calibrant) => {
    expect(calibrant.d.length).toBeGreaterThan(0);
    for (const d of calibrant.d) {
      expect(d).toBeGreaterThan(0);
    }
  },
);
