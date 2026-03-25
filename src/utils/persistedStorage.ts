import { Calibrant, IOBeamline, IODetector } from "./types";

const KEYS = {
  detectors: "dedi-user-detectors",
  beamlines: "dedi-user-beamlines",
  calibrants: "dedi-user-calibrants",
} as const;

function load<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function save<T>(key: string, data: Record<string, T>): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Fail silently — quota exceeded or localStorage unavailable.
  }
}

export function loadUserDetectors(): Record<string, IODetector> {
  return load<IODetector>(KEYS.detectors);
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
  return load<IOBeamline>(KEYS.beamlines);
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
  return load<Calibrant>(KEYS.calibrants);
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
