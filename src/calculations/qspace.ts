import { Vector3, Vector4 } from "three";
import { Detector } from "../utils/types";


export default class QSpace {
    static QSCALE_DEFAULT = 2 * Math.PI;
    private detector: Detector;
    private kmod: number;
    private ki: Vector3;
    private mki: Vector3;
    private qScale: number;
    private residual: number;
    private refrennce: Vector3;
    private stroks: Vector4;

    constructor(detector: Detector, diffexp: DiffractionCrystalEnvironment, scale: number) {

    }
}