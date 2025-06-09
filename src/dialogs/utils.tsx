import { createContext } from "react";

// If you change the schema watchout for this
export const FormUnits: Record<string, string> = {
  "resolution.width": "px",
  "resolution.height": "px",
  "pixelSize.width": "mm",
  "pixelSize.height": "mm",
  "mask.horizontalGap": "mm",
  "mask.verticalGap": "mm",
  "beamstop.diameter": "mm",
  "cameraTube.diameter": "mm",
  "wavelength.min": "nm",
  "wavelength.max": "nm",
  "cameraLength.min": "m",
  "cameraLength.max": "m",
  "cameraLength.step": "m",
};

export const UnitContext = createContext(FormUnits);
