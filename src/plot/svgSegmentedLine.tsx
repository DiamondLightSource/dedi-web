import type { SVGProps } from "react";
import { Vector3 } from "three";

interface SvgSegmentedLineProps extends SVGProps<SVGLineElement> {
  /** Start point in HTML space (from DataToHtml). */
  startPoint: Vector3;
  /** End point in HTML space (from DataToHtml). */
  endPoint: Vector3;
  /**
   * Accessible sub-ranges expressed as [t0, t1] fractions of [startPoint, endPoint].
   * Each pair must satisfy 0 ≤ t0 < t1 ≤ 1.
   * When empty the full line is drawn (no-mask fallback).
   */
  segments: [number, number][];
  strokeWidth?: number;
}

/** Linearly interpolates between two HTML-space points at parameter t. */
function lerp2D(a: Vector3, b: Vector3, t: number): [number, number] {
  return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
}

/**
 * Renders a straight line as one or more SVG `<line>` segments, with gaps
 * wherever the detector mask blocks the scatter path.
 *
 * Accepts the same HTML-space Vector3 points that DataToHtml produces.
 * Pass `segments={[[0, 1]]}` for an unbroken line. An empty `segments`
 * array renders nothing (fully blocked).
 */
export default function SvgSegmentedLine({
  startPoint,
  endPoint,
  segments,
  strokeWidth = 3,
  ...rest
}: SvgSegmentedLineProps): React.JSX.Element {
  return (
    <>
      {segments.map(([t0, t1], i) => {
        const [x1, y1] = lerp2D(startPoint, endPoint, t0);
        const [x2, y2] = lerp2D(startPoint, endPoint, t1);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={strokeWidth}
            {...rest}
          />
        );
      })}
    </>
  );
}
