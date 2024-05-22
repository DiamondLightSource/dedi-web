import Popover from "@mui/material/Popover";
import React from "react";
import { ColorResult, RGBColor, SketchPicker } from "react-color";
import { IconButton } from "@mui/material";
import { color2String } from "../plot/plotUtils";
import SquareIcon from "@mui/icons-material/Square";

/**
 * Renders a popover componenet with a color picker from react-color
 * @param props The current colour value, and change callback
 * @returns
 */
export default function ColourPickerPopover(props: {
  color: RGBColor;
  onChangeComplete: (color: ColorResult) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <div>
      <IconButton
        style={{ color: color2String(props.color) }}
        onClick={handleClick}
      >
        <SquareIcon></SquareIcon>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <SketchPicker
          color={props.color}
          onChangeComplete={props.onChangeComplete}
        />
      </Popover>
    </div>
  );
}
