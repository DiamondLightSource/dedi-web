import React from "react";

export function MessageDiagram(props: { message: string }): React.JSX.Element {
  return (
    <svg
      style={{
        display: "grid",
        maxHeight: "200px",
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
