import NumericRange from "../calculations/numericRange";
import { useResultStore } from "./resultsStore";

// in here to put the range diagram
export default function RangeDiagram(props: {
  visibleQRange: NumericRange;
  fullQRange: NumericRange;
}): JSX.Element {
  const svgRange = props.fullQRange.max - props.fullQRange.min;
  const visableStart = (props.visibleQRange.min / svgRange) * 100;
  const visbleWidth =
    ((props.visibleQRange.max - props.visibleQRange.min) / svgRange) * 100;
  const resultStore = useResultStore();

  const requestedMax = (resultStore.requestedRange.max / svgRange) * 100;
  const requestedMin = (resultStore.requestedRange.min / svgRange) * 100;
  const rectColour = props.visibleQRange.containsRange(
    resultStore.requestedRange,
  )
    ? "green"
    : "red";

  return (
    <svg
      style={{
        display: "grid",
        height: "100",
        width: "100",
        border: "solid black",
      }}
    >
      <rect
        y="0"
        x={`${visableStart}%`}
        width={`${visbleWidth}%`}
        height="50%"
        fill={rectColour}
      ></rect>
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
      <text y="60%" x={`${requestedMin}%`}>
        {" "}
        Requested min
      </text>
      <text y="80%" x={`${requestedMax}%`}>
        Requested max
      </text>
    </svg>
  );
}
