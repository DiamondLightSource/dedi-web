import { Vector3, Vector2 } from "three";

export interface DetectorProperties {
  origin: Vector3;
  beamVector: Vector3;
}

/**
 * Computes q-vectors from pixel positions on a flat, orthogonal detector.
 *
 * Uses the standard crystallographic definition:  q = k_f − k_i
 * where |k| = 2π / λ.  Each pixel position (x, y) and the camera length
 * (stored in detProps.origin.z) define the scattered wavevector k_f.
 */
export default class QSpace {
  detProps: DetectorProperties;
  /** Wavevector magnitude: k = 2π / λ */
  private kMag: number;
  /** Negative incident wavevector: −k_i */
  private negKi: Vector3;

  constructor(detProps: DetectorProperties, wavelength: number) {
    this.detProps = detProps;
    detProps.beamVector.normalize();
    this.kMag = (2 * Math.PI) / wavelength;
    this.negKi = detProps.beamVector.clone().multiplyScalar(-this.kMag);
  }

  /** Compute the q-vector for a pixel at position (x, y) on the detector. */
  public qFromPixelPosition(pixel: Vector2): Vector3 {
    // Displacement from pixel to beam centre in 3D detector coordinates
    const displacement = new Vector3(-pixel.x, -pixel.y, 0);
    displacement.add(this.detProps.origin);
    return this.convertToQ(displacement);
  }

  /** Update the wavevector magnitude for a new wavelength. */
  public setWavelength(wavelength: number): void {
    this.kMag = (2 * Math.PI) / wavelength;
    this.negKi = this.detProps.beamVector.clone().multiplyScalar(-this.kMag);
  }

  /**
   * Project the displacement vector onto the Ewald sphere to obtain k_f,
   * then subtract k_i to get q.
   */
  private convertToQ(displacement: Vector3): Vector3 {
    const length = displacement.length();
    if (length > 0) {
      displacement.multiplyScalar(this.kMag / length);
    }
    displacement.add(this.negKi);
    return displacement;
  }
}
