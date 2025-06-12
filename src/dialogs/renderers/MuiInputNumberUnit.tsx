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
  } = props;
  const InputComponent = useInputComponent();
  const inputProps = { step: "0.1" };

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
