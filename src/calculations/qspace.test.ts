import { expect, test } from "vitest";
import { Vector2, Vector3 } from "three";
import QSpace, { DetectorProperties } from "./qspace";

test("Test getting q from pixel position ", () => {
  const detProps: DetectorProperties = {
    resolution: {
      height: 1,
      width: 1,
    },
    pixelSize: {
      height: 1,
      width: 1,
    },
    origin: new Vector3(0, 0, 0),
    beamVector: new Vector3(1, 1, 0),
  };

  const qspace = new QSpace(detProps, 1, 1);
  const result = qspace.qFromPixelPosition(new Vector2(1, 1));
  expect(result).toBeInstanceOf(Vector3);
});
