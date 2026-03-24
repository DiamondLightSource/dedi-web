import {
  AppBar,
  Box,
  Card,
  CardContent,
  Stack,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import type { FallbackProps } from "react-error-boundary";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

export default function AppErrorFallBack({
  error,
}: FallbackProps): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack spacing={1}>
        <AppBar style={{ position: "static", width: "100%" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dedi Web
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            mx: 2,
            my: 1,
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ComponentErrorFallback error={error} resetErrorBoundary={() => {}} />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}

export function ComponentErrorFallback({
  error,
}: FallbackProps): React.JSX.Element {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, width: "100%" }}>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" color="error">
            Something went wrong
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          component="pre"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
}
