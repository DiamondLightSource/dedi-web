import React from "react";
import { useTheme } from "@mui/material";

export function MessageDiagram(props: { message: string }): React.JSX.Element {
  const theme = useTheme();
  return (
    <svg
      style={{
        display: "grid",
        maxHeight: "200px",
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <text
        x="40%"
        y="50%"
        style={{
          fontFamily: theme.typography.fontFamily,
          fontSize: "0.75rem",
          fill: theme.palette.text.secondary,
        }}
      >
        {props.message}
      </text>
    </svg>
  );
}
