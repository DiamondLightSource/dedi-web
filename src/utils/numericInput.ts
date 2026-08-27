import React from "react";

/** Rejects the minus sign so a negative value can never be typed. */
export function blockNegativeKey(
  event: React.KeyboardEvent<HTMLInputElement>,
): void {
  if (event.key === "-") {
    event.preventDefault();
  }
}

/** Rejects pasted text that would make the value negative. */
export function blockNegativePaste(
  event: React.ClipboardEvent<HTMLInputElement>,
): void {
  if (event.clipboardData.getData("text").trim().startsWith("-")) {
    event.preventDefault();
  }
}

/** Rejects dragged text that would make the value negative. */
export function blockNegativeDrop(
  event: React.DragEvent<HTMLInputElement>,
): void {
  if (event.dataTransfer.getData("text").trim().startsWith("-")) {
    event.preventDefault();
  }
}

/**
 * Props for the underlying `<input>` of a numeric field whose value cannot be
 * negative. Spread into the `htmlInput` slot of a TextField, or into the
 * `inputProps` of a bare MUI Input.
 */
export const nonNegativeInputProps = {
  min: 0,
  onKeyDown: blockNegativeKey,
  onPaste: blockNegativePaste,
  onDrop: blockNegativeDrop,
} as const;
