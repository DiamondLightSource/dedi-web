import { SxProps, Theme } from "@mui/material";

/**
 * Shared sx style for secondary action buttons (shortcut and dialog-opener buttons).
 * Filled with the same grey.100 as the card header strips so they feel part of
 * the card chrome rather than competing visually with primary inputs.
 */
export const secondaryButtonSx: SxProps<Theme> = {
  whiteSpace: "nowrap",
  bgcolor: "grey.100",
  borderColor: "divider",
  color: "text.secondary",
  "&:hover": {
    bgcolor: "grey.200",
    borderColor: "text.disabled",
  },
};
