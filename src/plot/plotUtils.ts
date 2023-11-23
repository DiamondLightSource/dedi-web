import NumericRange from "../calculations/numericRange";
import { RGBColor } from "react-color";
import { PlotAxes } from "./plotStore";
import { Vector3 } from "three";

// Questionable is this how you would do this think about it a little more
export const getDomains = (
  detector: PlotRectangle,
  cameraTube: PlotEllipse,
  axes: PlotAxes,
): { xAxis: NumericRange; yAxis: NumericRange } => {
  let offset = 500;
  if (axes === PlotAxes.milimeter) {
    offset = 100;
  }

  const minX = detector.lowerBound.x < cameraTube.endPointX.x ? detector.lowerBound.x : cameraTube.endPointX.x
  const maxX = detector.upperBound.x > cameraTube.endPointX.x ? detector.upperBound.x : cameraTube.endPointX.x

  const minY = detector.lowerBound.y < cameraTube.endPointX.y ? detector.lowerBound.y : cameraTube.endPointX.y
  const maxY = detector.upperBound.y > cameraTube.endPointX.y ? detector.upperBound.y : cameraTube.endPointX.y


  return {
    xAxis: new NumericRange(Math.round(minX - offset), Math.round(maxX + offset)),
    yAxis: new NumericRange(Math.round(minY - offset), Math.round(maxY + offset)),
  };
};

export const color2String = (color: RGBColor) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
};


export interface PlotEllipse {
  centre: Vector3
  endPointX: Vector3
  endPointY: Vector3
}


export const createPlotEllipse = (centre: { x?: number | null, y?: number | null }, diameter: number, pixelSize: { height: number, width: number }, plotAxes: PlotAxes): PlotEllipse => {
  let semiAxisX = (diameter / 2) / pixelSize.width
  let semiAxisY = (diameter / 2) / pixelSize.height
  let centreVec = new Vector3(centre.x ?? 0, centre.y ?? 0,);
  if (plotAxes === PlotAxes.milimeter) {
    semiAxisX = diameter / 2;
    semiAxisY = diameter / 2;
    centreVec.multiply(new Vector3(pixelSize.width, pixelSize.height))
  }

  return {
    centre: centreVec,
    endPointX: new Vector3(centreVec.x + semiAxisX, centreVec.y),
    endPointY: new Vector3(centreVec.x, centreVec.y + semiAxisY)
  }
}

export interface PlotRectangle {
  upperBound: Vector3
  lowerBound: Vector3
}

export const createPlotRectangle = (pinnedCorner: Vector3, resolution: { height: number, width: number }, pixelSize: { height: number, width: number }, plotAxes: PlotAxes): PlotRectangle => {
  let fullWidth = resolution.width;
  let fullHeight = resolution.height;
  switch (plotAxes) {
    case PlotAxes.milimeter:
      fullWidth *= pixelSize.width
      fullHeight *= pixelSize.height
  }
  return {
    lowerBound: pinnedCorner,
    upperBound: new Vector3(fullWidth, fullHeight)
  }
}

export interface PlotRange {
  start: Vector3
  end: Vector3
}

export const createPlotRange = (startPoint: Vector3, endPoint: Vector3, pixelSize: { height: number, width: number }, plotAxes: PlotAxes,): PlotRange => {
  const pixelVector = new Vector3(
    pixelSize.width,
    pixelSize.height,
  );

  if (plotAxes === PlotAxes.pixel) {
    return ({
      start: startPoint.clone().divide(pixelVector),
      end: endPoint.clone().divide(pixelVector)
    })
  }

  return {
    start: startPoint,
    end: endPoint
  }
}

export const createPlotClearance = (centre: { x?: number | null, y?: number | null }, diameter: number, pixelSize: { height: number, width: number }, plotAxes: PlotAxes, clearance: number) => {
  let semiAxisX = (diameter / 2) / pixelSize.width + clearance
  let semiAxisY = (diameter / 2) / pixelSize.height + clearance
  let centreVec = new Vector3(centre.x ?? 0, centre.y ?? 0,);

  if (plotAxes === PlotAxes.milimeter) {
    semiAxisX = (diameter / 2) + (clearance * pixelSize.width);
    semiAxisY = (diameter / 2) + (clearance * pixelSize.height);
    centreVec.multiply(new Vector3(pixelSize.width, pixelSize.height))
  }

  return {
    centre: centreVec,
    endPointX: new Vector3(centreVec.x + semiAxisX, centreVec.y),
    endPointY: new Vector3(centreVec.x, centreVec.y + semiAxisY)
  }
}