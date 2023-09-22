import { Vector3, Vector4 } from "three";
import { Detector } from "../utils/types";

export interface DiffractionCrystalEnvironment {
  wavelength: number;
  referenceNormal: Vector3;
  strokesVector: Vector4;
}

export interface DetectorProperties extends Detector {
  origin: Vector3;
  beamVector: Vector3;
}

export default class QSpace {
  detProps: DetectorProperties;
  kmod: number;
  reference: Vector3;
  strokes: Vector4;
  qScale: number;
  mki: Vector3;

  constructor(
    detProps: DetectorProperties,
    diffexp: DiffractionCrystalEnvironment,
    qScale: number,
  ) {
    this.detProps = detProps;
    detProps.beamVector.normalize();
    this.qScale = qScale;
    this.mki = new Vector3().copy(detProps.beamVector).negate();
    this.kmod = this.qScale / diffexp.wavelength;
    this.reference = diffexp.referenceNormal;
    this.strokes = diffexp.strokesVector;
  }

  convertToQ(q: Vector3) {
    const qLength = q.length();
    if (qLength > 0) {
      q.multiplyScalar(this.kmod / qLength);
      q.add(this.mki);
    } else {
      q.add(this.mki);
    }
  }

  qFromPixelPosition(x: number, y: number) {
    const q = new Vector3();
    q.set(
      -this.detProps.pixelSize.height * x,
      -this.detProps.pixelSize.width * y,
      0,
    );
    q.add(this.detProps.origin);
    this.convertToQ(q);
    return q;
  }

  setDiffractionCrystalEnviroment(diffexp: DiffractionCrystalEnvironment) {
    this.kmod = this.qScale / diffexp.wavelength;
    this.reference = diffexp.referenceNormal;
    this.strokes = diffexp.strokesVector;
  }
}
