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
