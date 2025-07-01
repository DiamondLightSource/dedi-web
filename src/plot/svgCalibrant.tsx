import type { SVGProps } from "react";
import { Vector3 } from "three";
import SvgAxisAlignedEllipse from "./svgEllipse";
import { SvgLine } from "@h5web/lib";
import React from "react";

export interface SvgCalibrantProps extends SVGProps<SVGEllipseElement> {
  beamCentre: Vector3;
  endPointX: Vector3;
  endPointY: Vector3;
  ringFractions: number[];
}

export default function SvgCalibrant(
  props: SvgCalibrantProps,
): React.JSX.Element {
  const { beamCentre, ringFractions, endPointX, endPointY, ...rest } = props;
  return (
    <>
      {ringFractions.map((item: number) => (
        <SvgAxisAlignedEllipse
          {...rest}
          key={item}
          coords={[
            beamCentre,
            getPointOnRing(beamCentre, endPointX, new Vector3(item, 1)),
            getPointOnRing(beamCentre, endPointY, new Vector3(1, item)),
          ]}
        />
      ))}
      <SvgLine
        strokeWidth={rest.strokeWidth}
        stroke={rest.stroke}
        coords={[getStartPointX(beamCentre, endPointX), endPointX]}
      />
    </>
  );
}

function getStartPointX(beamCentre: Vector3, point: Vector3): Vector3 {
  return new Vector3(2 * beamCentre.x - point.x, point.y);
}

function getPointOnRing(
  beamcentre: Vector3,
  point: Vector3,
  ringfraction: Vector3,
): Vector3 {
  return point.clone().sub(beamcentre).multiply(ringfraction).add(beamcentre);
}
