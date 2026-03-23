import { useTheme } from "@mui/material";
import UnitRange from "../calculations/unitRange";

interface RangeDiagramProps {
  visibleRange: UnitRange;
  requestedRange: UnitRange;
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
}: RangeDiagramProps): React.JSX.Element {
  const theme = useTheme();
  const svgRange = visibleRange.max.toNumber() - visibleRange.min.toNumber();
  const clamp = (v: number) => Math.max(0, Math.min(1000, (v / svgRange) * 1000));
  const requestedMinRaw = (requestedRange.min.toNumber() / svgRange) * 1000;
  const requestedMaxRaw = (requestedRange.max.toNumber() / svgRange) * 1000;
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
      <rect y="0" x="0" width="1000" height="80" fill={rectColour} />
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
        x={requestedMinRaw < 500 ? requestedMin : requestedMin}
        textAnchor={getTextAnchor(requestedMinRaw)}
        style={textStyle}
      >
        min
      </text>
      <text
        y={120}
        x={requestedMax}
        textAnchor={getTextAnchor(requestedMaxRaw)}
        style={textStyle}
      >
        max
      </text>
    </svg>
  );
}
