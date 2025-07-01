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
  Card,
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
import { useDetectorStore } from "../../data-entry/detectorStore";
import { useBeamlineConfigStore } from "../../data-entry/beamlineconfigStore";
import {
  IOBeamstop,
  IOCameraLimits,
  IOCircularDevice,
  IOWavelengthLimits,
  SimpleVector2,
} from "../../utils/types";
import { ErrorObject } from "ajv";
import React from "react";

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

interface CameraTubeForm {
  centre?: SimpleVector2;
  diameter?: number;
}

interface AppConfigForm {
  name: string;
  detector: string;
  beamstop: IOBeamstop;
  cameraTube?: CameraTubeForm;
  wavelengthLimits: IOWavelengthLimits;
  cameraLengthLimits: IOCameraLimits;
}

export default function AppConfigDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}): React.JSX.Element {
  const [data, setData] = useState<AppConfigForm | null>(null);
  const [errors, setErrors] = useState<ErrorObject[] | undefined>([]);
  const detectorRecord = useDetectorStore((state) => state.detectorRecord);
  const beamlineConfigStore = useBeamlineConfigStore();

  const newSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      detector: {
        ...schema.properties.detector,
        enum: Object.keys(detectorRecord),
      },
    },
  };

  const submitHandler = () => {
    if (!errors || errors.length > 0 || !data) {
      return;
    }
    const { name, cameraTube, ...rest } = data;

    let newCameraTube: IOCircularDevice | undefined = undefined;

    if (cameraTube?.diameter) {
      const newCentre = { ...data.beamstop.centre, ...cameraTube.centre };
      newCameraTube = {
        diameter: cameraTube.diameter,
        centre: newCentre,
      };
    }

    const preset = { cameraTube: newCameraTube, ...rest };
    beamlineConfigStore.addNewPreset(name, preset);
    setData(null);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"xl"}
      open={props.open}
      keepMounted
      onClose={props.handleClose}
    >
      <DialogTitle variant="h4" sx={{ display: "flex", alignItems: "center" }}>
        Beamline Configurations
        <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={8} style={{ display: "flex" }}>
            <Card sx={{ p: 2, flexGrow: 1 }} variant="outlined">
              <AppConfigTable />
            </Card>
          </Grid>
          <Grid item xs={12} lg={4} style={{ display: "flex" }}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1} width={"100%"}>
                <Typography variant="h5">
                  Add new beamline configuration:
                </Typography>
                <Divider />
                <UnitContext.Provider value={FormUnits}>
                  <JsonForms
                    data={data}
                    onChange={({ data, errors }) => {
                      setData(data as AppConfigForm);
                      setErrors(errors);
                    }}
                    schema={newSchema}
                    uischema={uischema}
                    renderers={renderers}
                  />
                </UnitContext.Provider>
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={submitHandler}
                >
                  Submit
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
