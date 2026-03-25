import { useTheme } from "@mui/material";
import UnitRange from "../calculations/unitRange";
import { AngstromSymbol } from "../utils/units";

const formatUnit = (u: import("mathjs").Unit): string =>
  u.format({ precision: 3 })
    .replace("angstrom^-1", `${AngstromSymbol}⁻¹`)
    .replace("angstrom", AngstromSymbol);

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
const getTextAnchor = (requestedValue: number): "start" | "end" => {
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
  const axisTextStyle = {
    ...textStyle,
    fontSize: "20px",
    fill: theme.palette.text.secondary,
  };

  const visMinLabel = formatUnit(visibleRange.min);
  const visMaxLabel = formatUnit(visibleRange.max);
  const reqMinLabel = formatUnit(requestedRange.min);
  const reqMaxLabel = formatUnit(requestedRange.max);

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
      if (rStart > cursor)
        deadZoneRects.push({ x: cursor, width: rStart - cursor });
      cursor = rEnd;
    }
    if (cursor < 1000) deadZoneRects.push({ x: cursor, width: 1000 - cursor });
  }

  return (
    <svg
      viewBox="0 0 1000 260"
      style={{
        display: "block",
        maxHeight: "195px",
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      {/* Full bar */}
      <rect y="50" x="0" width="1000" height="80" fill={rectColour} />
      {/* Grey dead zone patches */}
      {deadZoneRects.map(({ x, width }, i) => (
        <rect
          key={i}
          y="50"
          x={x}
          width={width}
          height="80"
          fill={theme.palette.grey[700]}
          opacity={0.55}
        />
      ))}

      {/* Requested min marker — line + label above bar */}
      <line x1={requestedMin} y1={10} x2={requestedMin} y2={154} style={lineStyle} />
      <text
        x={requestedMin}
        y={38}
        textAnchor={getTextAnchor(requestedMinSVG) as "start" | "end"}
        style={textStyle}
      >
        min
      </text>

      {/* Requested max marker — line + label above bar */}
      <line x1={requestedMax} y1={10} x2={requestedMax} y2={154} style={lineStyle} />
      <text
        x={requestedMax}
        y={38}
        textAnchor={getTextAnchor(requestedMaxSVG) as "start" | "end"}
        style={textStyle}
      >
        max
      </text>

      {/* Axis baseline */}
      <line
        x1={0} y1={154} x2={1000} y2={154}
        style={{ stroke: theme.palette.text.disabled, strokeWidth: 2 }}
      />
      {/* Visible range endpoint ticks */}
      <line x1={0} y1={154} x2={0} y2={174}
        style={{ stroke: theme.palette.text.disabled, strokeWidth: 2 }} />
      <line x1={1000} y1={154} x2={1000} y2={174}
        style={{ stroke: theme.palette.text.disabled, strokeWidth: 2 }} />

      {/* Visible range scale labels */}
      <text x={8} y={210} textAnchor="start" style={axisTextStyle}>
        {visMinLabel}
      </text>
      <text x={992} y={210} textAnchor="end" style={axisTextStyle}>
        {visMaxLabel}
      </text>

      {/* Requested range formatted values */}
      <text
        x={requestedMin}
        y={245}
        textAnchor={getTextAnchor(requestedMinSVG) as "start" | "end"}
        style={axisTextStyle}
      >
        {reqMinLabel}
      </text>
      <text
        x={requestedMax}
        y={245}
        textAnchor={getTextAnchor(requestedMaxSVG) as "start" | "end"}
        style={{ ...axisTextStyle, fill: theme.palette.text.primary }}
      >
        {reqMaxLabel}
      </text>
    </svg>
  );
}
