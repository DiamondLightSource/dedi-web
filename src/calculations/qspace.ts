import { Vector3, Vector2 } from "three";
import { Detector } from "../utils/types";

export interface DetectorProperties extends Detector {
  origin: Vector3;
  beamVector: Vector3;
}

/**
 * Collection of useful methods for finding the q range.
 * todo suggestion: more descriptive property names (mki? kmod?)
 */
export default class QSpace {
  detProps: DetectorProperties;
  kmod: number;
  qScale: number;
  mki: Vector3;

  constructor(
    detProps: DetectorProperties,
    wavelength: number,
    qScale: number,
  ) {
    this.detProps = detProps;
    detProps.beamVector.normalize();
    this.qScale = qScale;

    this.mki = detProps.beamVector.clone().negate();
    this.kmod = this.qScale / wavelength;
    const ki = this.detProps.beamVector.clone();
    ki.multiplyScalar(this.kmod);
    this.mki = ki.negate();
  }

  public qFromPixelPosition(vector: Vector2): Vector3 {
    const q = new Vector3();
    q.set(-vector.x, -vector.y, 0);
    q.add(this.detProps.origin);
    return this._convertToQ(q);
  }

  public setDiffractionCrystalEnviroment(wavelength: number): void {
    this.kmod = this.qScale / wavelength;
    const ki = this.detProps.beamVector.clone();
    ki.multiplyScalar(this.kmod);
    this.mki = ki.negate();
  }

  private _convertToQ(q: Vector3): Vector3 {
    const qLength = q.length();
    if (qLength > 0) {
      q.multiplyScalar(this.kmod / qLength);
      q.add(this.mki);
    } else {
      q.add(this.mki);
    }
    return q;
  }

}
