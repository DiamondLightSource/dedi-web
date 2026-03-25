import {
  Button,
  Checkbox,
  createTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  ThemeProvider,
  useTheme,
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
import { useState, useMemo } from "react";

import schema from "./schema.json";
import uischema from "./uischema.json";
import { JsonForms } from "@jsonforms/react";
import { FormUnits, UnitProvider } from "../utils";
import { secondaryButtonSx } from "../../utils/styles";
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

type UISchemaElement = {
  type: string;
  label?: string;
  scope?: string;
  elements?: UISchemaElement[];
};
const baseUischema = uischema as { type: string; elements: UISchemaElement[] };

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

interface DialogProps {
  open: boolean;
  handleClose: () => void;
}

/** Read-only dialog showing the full table of saved beamline configurations. */
export function AppConfigTableDialog({
  open,
  handleClose,
}: DialogProps): React.JSX.Element {
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle
        variant="h5"
        fontWeight={600}
        sx={{
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          py: 1.5,
        }}
      >
        Beamline configurations
        <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2, height: 500 }}>
        <AppConfigTable />
      </DialogContent>
    </Dialog>
  );
}

/** Form dialog for adding a new beamline configuration. */
export function AddAppConfigDialog({
  open,
  handleClose,
}: DialogProps): React.JSX.Element {
  const [data, setData] = useState<AppConfigForm | null>(null);
  const [errors, setErrors] = useState<ErrorObject[] | undefined>([]);
  const [hasCameraTube, setHasCameraTube] = useState(false);
  const detectorRecord = useDetectorStore((state) => state.detectorRecord);
  const beamlineConfigStore = useBeamlineConfigStore();
  const parentTheme = useTheme();
  const denseTheme = createTheme(parentTheme, {
    components: {
      MuiFormControl: { defaultProps: { size: "small", fullWidth: true } },
      MuiInputBase: { defaultProps: { size: "small" } },
    },
  });

  const displayUischema = useMemo(
    () => ({
      ...baseUischema,
      elements: baseUischema.elements.filter(
        (el) => hasCameraTube || el.label !== "Camera tube",
      ),
    }),
    [hasCameraTube],
  );

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
    if (!errors || errors.length > 0 || !data) return;
    const { name, cameraTube, ...rest } = data;

    let newCameraTube: IOCircularDevice | undefined = undefined;
    if (cameraTube?.diameter && cameraTube.centre) {
      newCameraTube = {
        diameter: cameraTube.diameter,
        centre: cameraTube.centre,
      };
    }

    beamlineConfigStore.addNewPreset(name, {
      cameraTube: newCameraTube,
      ...rest,
    });
    setData(null);
    setHasCameraTube(false);
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      keepMounted
      onClose={handleClose}
    >
      <DialogTitle
        variant="h5"
        fontWeight={600}
        sx={{
          bgcolor: "grey.100",
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          py: 1.5,
        }}
      >
        Add beamline configuration
        <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ p: 2, mt: 1, mb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={hasCameraTube}
                onChange={(_, checked) => {
                  setHasCameraTube(checked);
                  if (!checked) {
                    setData((prev) =>
                      prev ? { ...prev, cameraTube: undefined } : prev,
                    );
                  }
                }}
              />
            }
            label="Has camera tube"
          />
          <ThemeProvider theme={denseTheme}>
            <UnitProvider value={FormUnits}>
              <JsonForms
                data={data}
                onChange={({ data, errors }) => {
                  setData(data as AppConfigForm);
                  setErrors(errors);
                }}
                schema={newSchema}
                uischema={displayUischema}
                renderers={renderers}
                config={{ restrict: true }}
              />
            </UnitProvider>
          </ThemeProvider>
          <Button
            variant="outlined"
            type="submit"
            sx={secondaryButtonSx}
            onClick={submitHandler}
          >
            Add beamline
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
