/* eslint-disable */
import React, { useContext } from "react";
import { CellProps, WithClassname } from "@jsonforms/core";
import merge from "lodash/merge";
import {
  useDebouncedChange,
  useInputComponent,
  WithInputProps,
} from "@jsonforms/material-renderers";
import { InputAdornment } from "@mui/material";
import { UnitContext } from "../utils";
import {
  blockNegativeDrop,
  blockNegativeKey,
  blockNegativePaste,
} from "../../utils/numericInput";
import {
  ControlProps,
  isNumberControl,
  RankedTester,
  rankWith,
} from "@jsonforms/core";
import { MaterialInputControl } from "@jsonforms/material-renderers";
import { withJsonFormsControlProps } from "@jsonforms/react";

const toNumber = (value: string) =>
  value === "" ? undefined : parseFloat(value);
const eventToValue = (ev: any) => toNumber(ev.target.value);
export const MuiInputNumberUnit = React.memo(function MuiInputNumber(
  props: CellProps & WithClassname & WithInputProps,
) {
  const {
    data,
    className,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    config,
    label,
    schema,
  } = props;
  const InputComponent = useInputComponent();

  // Honour the schema's lower bound in the input itself: `min` alone only
  // constrains the spinner, so a non-negative field also rejects the minus
  // sign as it is typed, pasted or dropped in.
  const minimum = schema?.minimum;
  const inputProps = {
    step: "0.1",
    ...(minimum !== undefined && { min: minimum }),
    ...(minimum !== undefined &&
      minimum >= 0 && {
        onKeyDown: blockNegativeKey,
        onPaste: blockNegativePaste,
        onDrop: blockNegativeDrop,
      }),
  };

  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const [inputValue, onChange] = useDebouncedChange(
    handleChange,
    "",
    data,
    path,
    eventToValue,
  );

  const units = useContext(UnitContext)[path] ?? "";

  return (
    <InputComponent
      type="number"
      label={label}
      value={inputValue}
      onChange={onChange}
      className={className}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      inputProps={inputProps}
      fullWidth={true}
      endAdornment={<InputAdornment position="end">{units}</InputAdornment>}
    />
  );
});

export const MaterialNumberUnitControl = (props: ControlProps) => (
  <MaterialInputControl {...props} input={MuiInputNumberUnit} />
);

export const materialNumberUnitControlTester: RankedTester = rankWith(
  3,
  isNumberControl,
);

export default withJsonFormsControlProps(MaterialNumberUnitControl);
