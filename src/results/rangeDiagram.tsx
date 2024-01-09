import UnitRange from "../calculations/unitRange";

// keeping the text visible
const ESTIMATED_TEXT_LENGTH = 14;

export function MessageDiagram(props: { message: string }): JSX.Element {
  return (
    <svg
      style={{
        display: "grid",
        height: "40%",
        width: "90%",
        border: "solid black",
      }}
    >
      <text x="40%" y="50%">
        {props.message}
      </text>
    </svg>
  );
}

export function RangeDiagram(props: {
  visibleRange: UnitRange;
  fullRange: UnitRange;
  requestedRange: UnitRange;
}): JSX.Element {
  const svgRange =
    props.visibleRange.max.toNumber() - props.visibleRange.min.toNumber();
  const requestedMax = (props.requestedRange.max.toNumber() / svgRange) * 100;
  const requestedMin = (props.requestedRange.min.toNumber() / svgRange) * 100;
  const rectColour = props.visibleRange.containsRange(props.requestedRange)
    ? "green"
    : "red";
  // guess text length

  /**
   * Switch which side of the line text appears depending on which side of 50% the value is 
   * @param requestedValue - how far on the diagram to plot
   * @returns 
   */
  const keepTextVisible = (requestedValue: number): number => {
    if (requestedValue < 50) {
      return requestedValue;
    };
    return requestedValue - ESTIMATED_TEXT_LENGTH;
  }


  return (
    <svg
      style={{
        display: "grid",
        height: "40%",
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
      <text y="60%" x={`${keepTextVisible(requestedMin)}%`}>
        {" "}
        Requested min
      </text>
      <text y="80%" x={`${keepTextVisible(requestedMax)}%`}>
        Requested max
      </text>
    </svg>
  );
}
