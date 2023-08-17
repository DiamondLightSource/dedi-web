import { CircularDevice } from "./circularDevice";
import { Detector } from "../utils/types";

export interface BeamlineConfig {
  detector: Detector;
  Beamstop: CircularDevice;
  CameraTube: CircularDevice;
  angle: number;
  cameraLength: number;
  clearance: number; // remember to do int checks on this value
  minWavelength: number;
  maxWavelength: number;
  minCameraLength: number;
  maxCameraLength: number;
}
