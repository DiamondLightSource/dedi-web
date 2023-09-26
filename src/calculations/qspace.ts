import { Vector3, Vector2 } from "three";
import { Detector } from "../utils/types";

export interface DiffractionCrystalEnvironment {
  wavelength: number;
}

export interface DetectorProperties extends Detector {
  origin: Vector3;
  beamVector: Vector3;
}

export default class QSpace {
  detProps: DetectorProperties;
  kmod: number;
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


    this.mki = detProps.beamVector.clone().negate();
    this.kmod = this.qScale / diffexp.wavelength;
    const ki = this.detProps.beamVector.clone()
    ki.multiplyScalar(this.kmod)
    this.mki = ki.negate()
  }

  convertToQ(q: Vector3) {
    const qLength = q.length();
    if (qLength > 0) {
      q.multiplyScalar(this.kmod / qLength);
      q.add(this.mki);
    } else {
      q.add(this.mki);
    }
    return q
  }

  qFromPixelPosition(vector: Vector2) {
    const q = new Vector3();
    q.set(
      -vector.x,
      -vector.y,
      0,
    );
    q.add(this.detProps.origin);
    return this.convertToQ(q);
  }

  setDiffractionCrystalEnviroment(diffexp: DiffractionCrystalEnvironment) {
    this.kmod = this.qScale / diffexp.wavelength;
    const ki = this.detProps.beamVector.clone()
    ki.multiplyScalar(this.kmod)
    this.mki = ki.negate()
  }
}
