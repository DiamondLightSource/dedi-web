import { expect, test } from "vitest";
import { Vector4, Vector3 } from "three";
import QSpace, { DetectorProperties } from "./qspace";

test("Test getting q from pixel position ", () => {
    const detProps: DetectorProperties = {
        resolution: {
            height: 1,
            width: 1
        },
        pixelSize: {
            height: 1,
            width: 1
        },
        origin: new Vector3(0, 0, 0),
        beamVector: new Vector3(1, 1, 0),
    }

    const diffCrystEnv = {
        wavelength: 1,
        referenceNormal: new Vector3(1, 1, 1),
        strokesVector: new Vector4(1, 0, 1, 0),
    }

    const qspace = new QSpace(detProps, diffCrystEnv, 1)
    const result = qspace.qFromPixelPosition(1, 1)
    expect(result).toBeInstanceOf(Vector3)
    // do better testing when you understand it better
});
