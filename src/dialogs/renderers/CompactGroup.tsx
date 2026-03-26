/* eslint-disable */
import { MaterialLayoutRenderer } from "@jsonforms/material-renderers";
import { Box, Divider, Typography } from "@mui/material";

import { withJsonFormsLayoutProps } from "@jsonforms/react";

import { rankWith, uiTypeIs } from "@jsonforms/core";

export const CompactGroupTester = rankWith(1000, uiTypeIs("Group"));

const CompactGroupRenderer = (props: any) => {
  const { uischema, schema, path, visible, renderers, enabled } = props;

  const layoutProps = {
    elements: uischema.elements,
    schema: schema,
    path: path,
    direction: "column" as "row" | "column",
    visible: visible,
    uischema: uischema,
    renderers: renderers,
    enabled: enabled,
  };
  return (
    <Box>
      <Divider textAlign="left" sx={{ mb: 1.5, mt: 0.5 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: 1, lineHeight: 1 }}
        >
          {uischema.label}
        </Typography>
      </Divider>
      <MaterialLayoutRenderer {...layoutProps} />
    </Box>
  );
};

export default withJsonFormsLayoutProps(CompactGroupRenderer);
