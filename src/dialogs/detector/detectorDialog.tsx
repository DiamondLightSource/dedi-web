import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useDetectorStore } from "../../data-entry/detectorStore";
import DetectorTable from "./detectorTable";
import CloseIcon from "@mui/icons-material/Close";
import { materialRenderers } from "@jsonforms/material-renderers";
import schema from "./schema.json";
import uischema from "./uischema.json";
import { JsonForms } from "@jsonforms/react";
import { IODetector } from "../../utils/types";
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
import { FormUnits, UnitContext } from "../utils";
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

export default function DetectorDialog(props: {
  open: boolean;
  handleClose: () => void;
  handleOpen: () => void;
}) {
  const detectorStore = useDetectorStore();
  const [data, setData] = useState<DetectorForm | null>(null);
  const [errors, setErrors] = useState<ErrorObject[] | undefined>([]);
  const submitHandler = () => {
    if (!errors || errors.length > 0 || !data) {
      return;
    }
    const { name, mask, ...rest } = data;
    let detector: IODetector;
    if (!mask) {
      detector = rest;
    } else {
      const detectorMask = {
        horizontalModules: 1,
        verticalModules: 1,
        horizontalGap: 0,
        verticalGap: 0,
        missingModules: [],
        ...mask,
      };
      detector = { mask: detectorMask, ...rest };
    }
    detectorStore.addNewDetector(name, createInternalDetector(detector));
    setData(null);
  };

  return (
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.handleClose}
      maxWidth={"xl"}
      fullWidth={true}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h4"> Detectors </Typography>
        <IconButton onClick={props.handleClose} sx={{ ml: "auto" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={8} style={{display: 'flex'}}>
            <Card sx={{p:2, flexGrow: 1}} variant="outlined">
              <DetectorTable />
            </Card>
          </Grid>
          <Grid item xs={12} lg={4} style={{display: 'flex'}} >
            <Card variant="outlined" sx={{p:2}}>
            <Stack spacing={1} width={"100%"}>
              <Typography variant="h5"> Add new Detector:</Typography>
              <Divider />
              <UnitContext.Provider value={FormUnits}>
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
              </UnitContext.Provider>
              <Button variant="outlined" type="submit" onClick={submitHandler}>
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
