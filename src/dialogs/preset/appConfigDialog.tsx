import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Divider,
  Grid,
  Button,
  Stack,
} from "@mui/material";
import AppConfigTable from "./appConfigTable";
import CloseIcon from "@mui/icons-material/Close";

import MaterialNumberUnitControl, {
  materialNumberUnitControlTester,
} from "../renderers/MuiInputNumberUnit";
import MaterialIntegerUnitControl, {
  materialIntegerUnitControlTester,
} from "../renderers/MuiInputIntegerUnit";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import { materialRenderers } from "@jsonforms/material-renderers";
import { useState } from "react";

import schema from "./schema.json";
import uischema from "./uischema.json";
import { JsonForms } from "@jsonforms/react";
import { FormUnits, UnitContext } from "../utils";

const renderers = [
  ...materialRenderers,
  {
    tester: materialNumberUnitControlTester,
    renderer: MaterialNumberUnitControl,
  },
  {
    tester: materialIntegerUnitControlTester,
    renderer: MaterialIntegerUnitControl,
  },
  { tester: CompactGroupTester, renderer: CompactGroupRenderer },
];

export default function AppConfigDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): JSX.Element {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xl"}
      open={props.open}
      keepMounted
      onClose={props.handleClose}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h4"> Beamline Configurations </Typography>
        <Divider />
        <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <AppConfigTable />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack spacing={1} width={"100%"}>
              <Typography variant="h5">
                {" "}
                Add new beamline configuration:
              </Typography>
              <UnitContext.Provider value={FormUnits}>
                <JsonForms
                  data={data}
                  onChange={({ data, errors }) => {
                    setData(data);
                    setErrors(errors);
                  }}
                  schema={schema}
                  uischema={uischema}
                  renderers={renderers}
                />
              </UnitContext.Provider>
              <Button variant="outlined" type="submit">
                Submit
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
