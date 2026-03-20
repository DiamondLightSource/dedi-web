import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
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
    <Dialog open={open} keepMounted onClose={handleClose} maxWidth="sm" fullWidth>
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
          <Stack spacing={1} sx={{ p: 2 , mt:1}}>
            <UnitProvider value={FormUnits}>
              <JsonForms
                data={data}
                onChange={({ data, errors }) => {
                  setData(data as DetectorForm);
                  setErrors(errors);
                }}
                schema={schema}
                uischema={uischema}
                renderers={renderers}
              />
            </UnitProvider>
            <Button
              variant="outlined"
              type="submit"
              sx={secondaryButtonSx}
              onClick={submitHandler}
            >
              Submit
            </Button>
          </Stack>
      </DialogContent>
    </Dialog>
  );
}
