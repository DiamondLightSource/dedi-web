import { Stack, Typography } from "@mui/material";
import React from "react";

/**
 * A consistent label / value row for data-entry cards.
 * The label appears in a fixed-width muted column on the left;
 * the value (and an optional action such as a unit selector) fills the rest.
 */
export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 90, flexShrink: 0 }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}
