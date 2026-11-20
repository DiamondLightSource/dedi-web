import { Calibrant, IOBeamline, IODetector } from "./types";
import { formatLogMessage } from "./units";

const KEYS = {
  detectors: "dedi-user-detectors",
  beamlines: "dedi-user-beamlines",
  calibrants: "dedi-user-calibrants",
} as const;

// ---------------------------------------------------------------------------
// Shape checks for data read back from localStorage. Stored data can be
// stale (older app versions) or edited by hand, and is read at module load,
// before any error boundary exists, so anything malformed is dropped here.
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;

const isObject = (v: unknown): v is Obj =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const isNonNegative = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;

const isPositive = (v: unknown): v is number => isNonNegative(v) && v > 0;

const isOptionalCoordinate = (v: unknown): boolean =>
  v === undefined ||
  v === null ||
  (typeof v === "number" && Number.isFinite(v));

const isPair = (v: unknown, check: (n: unknown) => boolean): v is Obj =>
  isObject(v) && check(v.width) && check(v.height);

const isCircularDevice = (v: unknown): v is Obj =>
  isObject(v) &&
  isObject(v.centre) &&
  isOptionalCoordinate(v.centre.x) &&
  isOptionalCoordinate(v.centre.y) &&
  isNonNegative(v.diameter);

function isMask(v: unknown): boolean {
  if (!isObject(v)) return false;
  const modulesOk =
    Number.isInteger(v.horizontalModules) &&
    (v.horizontalModules as number) >= 1 &&
    Number.isInteger(v.verticalModules) &&
    (v.verticalModules as number) >= 1;
  const missingOk =
    v.missingModules === undefined ||
    (Array.isArray(v.missingModules) &&
      v.missingModules.every((m) => Number.isInteger(m) && m >= 0));
  return (
    modulesOk &&
    isNonNegative(v.horizontalGap) &&
    isNonNegative(v.verticalGap) &&
    missingOk
  );
}

export function isIODetector(v: unknown): v is IODetector {
  return (
    isObject(v) &&
    isPair(v.resolution, isPositive) &&
    isPair(v.pixelSize, isPositive) &&
    (v.mask === undefined || isMask(v.mask))
  );
}

export function isIOBeamline(v: unknown): v is IOBeamline {
  if (!isObject(v)) return false;
  const { beamstop, cameraTube, wavelengthLimits, cameraLengthLimits } = v;
  return (
    typeof v.detector === "string" &&
    isCircularDevice(beamstop) &&
    (beamstop.clearance === null || isNonNegative(beamstop.clearance)) &&
    (cameraTube === undefined || isCircularDevice(cameraTube)) &&
    isObject(wavelengthLimits) &&
    isPositive(wavelengthLimits.min) &&
    isPositive(wavelengthLimits.max) &&
    isObject(cameraLengthLimits) &&
    isNonNegative(cameraLengthLimits.min) &&
    isNonNegative(cameraLengthLimits.max) &&
    isPositive(cameraLengthLimits.step)
  );
}

export function isCalibrant(v: unknown): v is Calibrant {
  return (
    isObject(v) && Array.isArray(v.d) && v.d.length > 0 && v.d.every(isPositive)
  );
}

function load<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): Record<string, T> {
  let parsed: unknown;
  try {
    const raw = localStorage.getItem(key);
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
  if (!isObject(parsed)) {
    console.warn(formatLogMessage(`Ignoring saved "${key}": not an object`));
    return {};
  }
  const valid: Record<string, T> = {};
  for (const [name, value] of Object.entries(parsed)) {
    if (isValid(value)) {
      valid[name] = value;
    } else {
      console.warn(
        formatLogMessage(
          `Ignoring malformed saved entry "${name}" in "${key}"`,
        ),
      );
    }
  }
  return valid;
}

function save<T>(key: string, data: Record<string, T>): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Fail silently — quota exceeded or localStorage unavailable.
  }
}

export function loadUserDetectors(): Record<string, IODetector> {
  return load(KEYS.detectors, isIODetector);
}

export function saveUserDetectors(data: Record<string, IODetector>): void {
  save(KEYS.detectors, data);
}

export function deleteUserDetector(
  name: string,
  current: Record<string, IODetector>,
): Record<string, IODetector> {
  const rest = Object.fromEntries(
    Object.entries(current).filter(([k]) => k !== name),
  );
  save(KEYS.detectors, rest);
  return rest;
}

export function loadUserBeamlines(): Record<string, IOBeamline> {
  return load(KEYS.beamlines, isIOBeamline);
}

export function saveUserBeamlines(data: Record<string, IOBeamline>): void {
  save(KEYS.beamlines, data);
}

export function deleteUserBeamline(
  name: string,
  current: Record<string, IOBeamline>,
): Record<string, IOBeamline> {
  const rest = Object.fromEntries(
    Object.entries(current).filter(([k]) => k !== name),
  );
  save(KEYS.beamlines, rest);
  return rest;
}

export function loadUserCalibrants(): Record<string, Calibrant> {
  return load(KEYS.calibrants, isCalibrant);
}

export function saveUserCalibrants(data: Record<string, Calibrant>): void {
  save(KEYS.calibrants, data);
}

export function deleteUserCalibrant(
  name: string,
  current: Record<string, Calibrant>,
): Record<string, Calibrant> {
  const rest = Object.fromEntries(
    Object.entries(current).filter(([k]) => k !== name),
  );
  save(KEYS.calibrants, rest);
  return rest;
}
