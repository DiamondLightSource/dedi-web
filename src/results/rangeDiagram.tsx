import { useTheme } from "@mui/material";
import UnitRange from "../calculations/unitRange";

interface RangeDiagramProps {
  visibleRange: UnitRange;
  requestedRange: UnitRange;
  /** Accessible sub-ranges after subtracting mask dead zones. Gaps between
   * these ranges are rendered as grey patches on the diagram bar. */
  accessibleRanges?: UnitRange[];
}

/**
 * Switch which side of the line text appears
 * depending on which side of 50% the value is
 * @param requestedValue - how far on the diagram to plot
 * @returns
 */
const getTextAnchor = (requestedValue: number): string => {
  return requestedValue < 500 ? "start" : "end";
};

export function RangeDiagram({
  visibleRange,
  requestedRange,
  accessibleRanges,
}: RangeDiagramProps): React.JSX.Element {
  const theme = useTheme();
  const visMin = visibleRange.min.toNumber();
  const visMax = visibleRange.max.toNumber();
  const svgRange = visMax - visMin;
  // Map a value in the same unit space as visibleRange to SVG x in [0, 1000].
  const toSVG = (v: number) => ((v - visMin) / svgRange) * 1000;
  const clamp = (v: number) => Math.max(0, Math.min(1000, toSVG(v)));
  const requestedMinSVG = toSVG(requestedRange.min.toNumber());
  const requestedMaxSVG = toSVG(requestedRange.max.toNumber());
  const requestedMin = clamp(requestedRange.min.toNumber());
  const requestedMax = clamp(requestedRange.max.toNumber());
  const rectColour = visibleRange.containsRange(requestedRange)
    ? theme.palette.success.main
    : theme.palette.error.main;
  const lineStyle = { stroke: theme.palette.text.primary, strokeWidth: 4 };
  const textStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: "24px",
    fill: theme.palette.text.primary,
  };

  // Compute dead zone rectangles as the gaps between accessible sub-ranges.
  const deadZoneRects: { x: number; width: number }[] = [];
  if (accessibleRanges && accessibleRanges.length > 0) {
    const sorted = [...accessibleRanges].sort(
      (a, b) => a.min.toNumber() - b.min.toNumber(),
    );
    let cursor = 0;
    for (const r of sorted) {
      const rStart = clamp(r.min.toNumber());
      const rEnd = clamp(r.max.toNumber());
      if (rStart > cursor) deadZoneRects.push({ x: cursor, width: rStart - cursor });
      cursor = rEnd;
    }
    if (cursor < 1000) deadZoneRects.push({ x: cursor, width: 1000 - cursor });
  }

  return (
    <svg
      viewBox="0 0 1000 200"
      style={{
        display: "block",
        maxHeight: "150px",
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {/* Full bar — success/error colour */}
      <rect y="0" x="0" width="1000" height="80" fill={rectColour} />
      {/* Grey dead zone patches overlaid on the bar */}
      {deadZoneRects.map(({ x, width }, i) => (
        <rect key={i} y="0" x={x} width={width} height="80"
          fill={theme.palette.grey[700]} opacity={0.55} />
      ))}
      <line
        x1={requestedMin}
        y1={0}
        x2={requestedMin}
        y2={80}
        style={lineStyle}
      />
      <line
        x1={requestedMax}
        y1={0}
        x2={requestedMax}
        y2={100}
        style={lineStyle}
      />
      <text
        y={100}
        x={requestedMin}
        textAnchor={getTextAnchor(requestedMinSVG)}
        style={textStyle}
      >
        min
      </text>
      <text
        y={120}
        x={requestedMax}
        textAnchor={getTextAnchor(requestedMaxSVG)}
        style={textStyle}
      >
        max
      </text>
    </svg>
  );
}
