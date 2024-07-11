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
  return requestedValue < 50 ? "start" : "end";
};

export function RangeDiagram({
  visibleRange,
  requestedRange,
}: RangeDiagramProps): JSX.Element {
  const svgRange = visibleRange.max.toNumber() - visibleRange.min.toNumber();
  const requestedMax = (requestedRange.max.toNumber() / svgRange) * 100;
  const requestedMin = (requestedRange.min.toNumber() / svgRange) * 100;
  const rectColour = visibleRange.containsRange(requestedRange)
    ? "green"
    : "red";

  // guess text length

  return (
    <svg
      style={{
        display: "grid",
        maxHeight: "200px",
        width: "90%",
        border: "solid black",
      }}
    >
      <rect y="0" x="0" width={`100%`} height="50%" fill={rectColour}></rect>
      <line
        x1={`${requestedMin}%`}
        y1={0}
        x2={`${requestedMin}%`}
        y2="50%"
        style={{ stroke: "black", strokeWidth: 2 }}
      />
      <line
        x1={`${requestedMax}%`}
        y1={0}
        x2={`${requestedMax}%`}
        y2="60%"
        style={{ stroke: "black", strokeWidth: 2 }}
      />
      <text
        y="60%"
        x={`${requestedMin}%`}
        textAnchor={getTextAnchor(requestedMin)}
      >
        {" "}
        Requested min
      </text>
      <text
        y="80%"
        x={`${requestedMax}%`}
        textAnchor={getTextAnchor(requestedMax)}
      >
        Requested max
      </text>
    </svg>
  );
}
