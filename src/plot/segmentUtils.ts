import NumericRange from "../calculations/numericRange";

/**
 * Converts accessible q-sub-ranges into [t0, t1] fractions of a full range,
 * clamped to [0, 1]. Returns [[0, 1]] when the accessible list is empty so
 * that detectors without a mask render a single unbroken line.
 */
export function toSegments(
  accessible: NumericRange[],
  fullRange: NumericRange,
): [number, number][] {
  if (accessible.length === 0) return [[0, 1]];
  const span = fullRange.max - fullRange.min;
  if (span === 0) return [];
  return accessible
    .map((r): [number, number] => [
      (r.min - fullRange.min) / span,
      (r.max - fullRange.min) / span,
    ])
    .filter(([t0, t1]) => t1 > 0 && t0 < 1)
    .map(([t0, t1]) => [Math.max(0, t0), Math.min(1, t1)]);
}
