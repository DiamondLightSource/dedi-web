import {
  AppBar,
  Card,
  CardContent,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

export default function AppErrorFallBack(props: {
  message: string;
}): JSX.Element {
  return (
    <>
      <CssBaseline>
        <Stack spacing={1}>
          <AppBar style={{ position: "static", width: "100%" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Dedi Web
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ margin: "10px", flexGrow: 1 }}>
            <ComponentErrorFallback {...props} />
          </div>
        </Stack>
      </CssBaseline>
    </>
  );
}

export function ComponentErrorFallback(props: {
  message: string;
}): JSX.Element {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography> {props.message}</Typography>
      </CardContent>
    </Card>
  );
}
