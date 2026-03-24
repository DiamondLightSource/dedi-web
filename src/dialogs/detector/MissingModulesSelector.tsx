import { Box, Typography } from "@mui/material";
import React from "react";

interface MissingModulesSelectorProps {
  horizontalModules: number;
  verticalModules: number;
  missingModules: number[];
  onChange: (missingModules: number[]) => void;
}

/**
 * Renders a grid of toggle buttons representing detector modules.
 * Click a module to mark it as missing (highlighted) or restore it.
 * Module index follows row-major order: idx = row * horizontalModules + col.
 */
export default function MissingModulesSelector({
  horizontalModules,
  verticalModules,
  missingModules,
  onChange,
}: MissingModulesSelectorProps): React.JSX.Element {
  const toggle = (idx: number) => {
    if (missingModules.includes(idx)) {
      onChange(missingModules.filter((m) => m !== idx));
    } else {
      onChange([...missingModules, idx].sort((a, b) => a - b));
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Missing modules — click to toggle
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${horizontalModules}, minmax(0, 50px))`,
          gap: "2px",
          justifyContent: "center",
        }}
      >
        {Array.from(
          { length: verticalModules * horizontalModules },
          (_, idx) => {
            const isMissing = missingModules.includes(idx);
            return (
              <Box
                key={idx}
                onClick={() => toggle(idx)}
                title={`Module ${idx} (col ${idx % horizontalModules}, row ${Math.floor(idx / horizontalModules)})`}
                sx={{
                  aspectRatio: "1",
                  borderRadius: 0.5,
                  cursor: "pointer",
                  bgcolor: isMissing ? "primary.main" : "grey.300",
                  border: "1px solid",
                  borderColor: isMissing ? "primary.dark" : "grey.400",
                  transition: "background-color 0.15s",
                  "&:hover": {
                    bgcolor: isMissing ? "primary.light" : "grey.400",
                  },
                }}
              />
            );
          },
        )}
      </Box>
      {missingModules.length > 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: "block" }}
        >
          Missing: [{missingModules.join(", ")}]
        </Typography>
      )}
    </Box>
  );
}
