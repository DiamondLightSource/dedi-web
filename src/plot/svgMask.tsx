import { SvgRect } from "@h5web/lib";
import type { SVGProps } from "react";
import { Vector3 } from "three";

type Rect = [Vector3, Vector3];

export interface SvgMaskProps extends SVGProps<SVGPathElement> {
  coords: Rect;
  strokePosition?: "inside" | "outside";
  strokeWidth?: number;
  numModules: Vector3;
  gapFraction: Vector3;
  missingSegments: number[];
}

export default function SvgMask(props: SvgMaskProps) {
  const { gapFraction, missingSegments, numModules, ...rest } = props;

  // check if clone is needed later on
  const [detectorUpper, detectorLower] = rest.coords;

  // Get full length and width of detector
  const fulllength = detectorLower.clone().sub(detectorUpper);
  // Get the length of the horizontal and vertical gaps between modules
  const gaplength = fulllength.clone().multiply(gapFraction);
  // Get the length and width of each detctor module from the detector length,
  // number of gaps, gap length, and the number of modules
  //
  // module length =
  //    (detector length - (number of gaps)*(gap length))/(number of modules)
  const moduleLength = fulllength
    .clone()
    .sub(gaplength.clone().multiply(numModules.clone().subScalar(1)))
    .divide(numModules);

  return (
    <>
      {/* plot vertical stripes */}
      {[...Array(numModules.x - 1).keys()].map((i: number) => (
        <SvgRect
          {...rest}
          key={i}
          coords={generateVerticalStripes(
            rest.coords,
            moduleLength.x,
            gaplength.x,
            i + 1,
          )}
          fill={rest.fill}
        />
      ))}
      {/* plot horizontal stripes */}
      {[...Array(numModules.y - 1).keys()].map((item: number) => (
        <SvgRect
          {...rest}
          key={item}
          coords={generateHorizontalStripes(
            rest.coords,
            moduleLength.y,
            gaplength.y,
            item + 1,
          )}
          fill={rest.fill}
        />
      ))}
      {/* plot missing sections*/}
      {missingSegments.map((item: number) => (
        <SvgRect
          {...rest}
          key={item}
          coords={generateMissingModule(
            rest.coords,
            numModules,
            moduleLength,
            gaplength,
            item,
          )}
          fill={rest.fill}
        />
      ))}
    </>
  );
}

function generateLowerBound(
  moduleLen: number,
  gapLen: number,
  moduleNum: number,
): number {
  return moduleNum * moduleLen + (moduleNum - 1) * gapLen;
}

function generateUpperBound(
  moduleLen: number,
  gapLen: number,
  moduleNum: number,
): number {
  return moduleNum * moduleLen + moduleNum * gapLen;
}

function generateVerticalStripes(
  coords: Rect,
  moduleLenX: number,
  gapLenX: number,
  idx: number,
): Rect {
  return [
    new Vector3(
      coords[0].x + generateLowerBound(moduleLenX, gapLenX, idx),
      coords[0].y,
    ),
    new Vector3(
      coords[0].x + generateUpperBound(moduleLenX, gapLenX, idx),
      coords[1].y,
    ),
  ];
}

function generateHorizontalStripes(
  coords: Rect,
  moduleLenY: number,
  gapLenY: number,
  idx: number,
): Rect {
  return [
    new Vector3(
      coords[0].x,
      coords[0].y + generateLowerBound(moduleLenY, gapLenY, idx),
    ),
    new Vector3(
      coords[1].x,
      coords[0].y + generateUpperBound(moduleLenY, gapLenY, idx),
    ),
  ];
}

function generateMissingModule(
  coords: Rect,
  moduleNum: Vector3,
  moduleLen: Vector3,
  gapLen: Vector3,
  idx: number,
): Rect {
  return [
    new Vector3(
      coords[0].x + (moduleLen.x + gapLen.x) * (idx % moduleNum.x),
      coords[0].y + (moduleLen.y + gapLen.y) * Math.floor(idx / moduleNum.x),
    ),
    new Vector3(
      coords[0].x +
        (moduleLen.x + gapLen.x) * (idx % moduleNum.x) +
        moduleLen.x,
      coords[0].y +
        (moduleLen.y + gapLen.y) * Math.floor(idx / moduleNum.x) +
        moduleLen.y,
    ),
  ];
}
