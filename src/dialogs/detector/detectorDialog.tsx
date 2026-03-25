import {
  Button,
  createTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { useDetectorStore } from "../../data-entry/detectorStore";
import DetectorTable from "./detectorTable";
import CloseIcon from "@mui/icons-material/Close";
import { materialRenderers } from "@jsonforms/material-renderers";
import schema from "./schema.json";
import uischema from "./uischema.json";
import { JsonForms } from "@jsonforms/react";
import { DetectorMask, IODetector } from "../../utils/types";
import { useState } from "react";
import { createInternalDetector } from "../../presets/presetManager";
import MaterialNumberUnitControl, {
  materialNumberUnitControlTester,
} from "../renderers/MuiInputNumberUnit";
import MaterialIntegerUnitControl, {
  materialIntegerUnitControlTester,
} from "../renderers/MuiInputIntegerUnit";
import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import { FormUnits, UnitProvider } from "../utils";
import { secondaryButtonSx } from "../../utils/styles";
import { ErrorObject } from "ajv";
import MissingModulesSelector from "./MissingModulesSelector";

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

interface DetectorForm {
  name: string;
  resolution: { height: number; width: number };
  pixelSize: { height: number; width: number };
  mask: {
    horizontalModules?: number;
    verticalModules?: number;
    horizontalGap?: number;
    verticalGap?: number;
    missingModules?: number[];
  };
}

const defaultMask: DetectorMask = {
  horizontalModules: 1,
  verticalModules: 1,
  horizontalGap: 0,
  verticalGap: 0,
  missingModules: [],
};

interface DialogProps {
  open: boolean;
  handleClose: () => void;
}

/** Read-only dialog showing the full table of available detectors. */
export function DetectorTableDialog({ open, handleClose }: DialogProps) {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
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
        Available detectors
        <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 2, height: 500 }}>
        <DetectorTable />
      </DialogContent>
    </Dialog>
  );
}

/** Form dialog for adding a custom detector. */
export function AddDetectorDialog({ open, handleClose }: DialogProps) {
  const detectorStore = useDetectorStore();
  const [data, setData] = useState<DetectorForm | null>(null);
  const [errors, setErrors] = useState<ErrorObject[] | undefined>([]);
  const parentTheme = useTheme();
  const denseTheme = createTheme(parentTheme, {
    components: {
      MuiFormControl: { defaultProps: { size: "small", fullWidth: true } },
      MuiInputBase: { defaultProps: { size: "small" } },
    },
  });

  const submitHandler = () => {
    if (!errors || errors.length > 0 || !data) return;
    const { name, mask, ...rest } = data;
    let detector: IODetector;
    if (!mask) {
      detector = rest;
    } else {
      detector = { mask: { ...defaultMask, ...mask }, ...rest };
    }
    detectorStore.addNewDetector(name, createInternalDetector(detector));
    setData(null);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
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
        Add new detector
        <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ p: 2, mt: 1 }}>
          <ThemeProvider theme={denseTheme}>
            <UnitProvider value={FormUnits}>
              <JsonForms
                data={data}
                onChange={({ data: newData, errors }) => {
                  const prev = data as DetectorForm | null;
                  const next = newData as DetectorForm | null;
                  // Reset missing modules when module grid dimensions change
                  if (
                    next?.mask &&
                    (prev?.mask?.horizontalModules !==
                      next.mask.horizontalModules ||
                      prev?.mask?.verticalModules !== next.mask.verticalModules)
                  ) {
                    next.mask.missingModules = [];
                  }
                  setData(next);
                  setErrors(errors);
                }}
                schema={schema}
                uischema={uischema}
                renderers={renderers}
                config={{ restrict: true, trim: true }}
              />
            </UnitProvider>
          </ThemeProvider>
          {data?.mask?.horizontalModules != null &&
            data.mask.horizontalModules >= 1 &&
            data?.mask?.verticalModules != null &&
            data.mask.verticalModules >= 1 && (
              <MissingModulesSelector
                horizontalModules={data.mask.horizontalModules}
                verticalModules={data.mask.verticalModules}
                missingModules={data.mask.missingModules ?? []}
                onChange={(missingModules) =>
                  setData((prev) =>
                    prev
                      ? { ...prev, mask: { ...prev.mask, missingModules } }
                      : prev,
                  )
                }
              />
            )}
          <Button
            variant="outlined"
            type="submit"
            sx={secondaryButtonSx}
            onClick={submitHandler}
          >
            Add detector
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
