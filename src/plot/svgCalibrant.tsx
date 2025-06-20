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
  return (
    <>
      {props.ringFractions.map((item: number) => (
        <SvgAxisAlignedEllipse
          {...props}
          key={item}
          coords={[
            props.beamCentre,
            getPointOnRing(
              props.beamCentre,
              props.endPointX,
              new Vector3(item, 1),
            ),
            getPointOnRing(
              props.beamCentre,
              props.endPointY,
              new Vector3(1, item),
            ),
          ]}
        />
      ))}
      <SvgLine
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        coords={[
          getStartPointX(props.beamCentre, props.endPointX),
          props.endPointX,
        ]}
      />
    </>
  );
}

function getStartPointX(beamCentre: Vector3, point: Vector3): Vector3 {
  return new Vector3(2 * beamCentre.x - point.x, point.y);
}

function getPointOnRing(
  beamCentre: Vector3,
  point: Vector3,
  ringFraction: Vector3,
): Vector3 {
  return point.clone().sub(beamCentre).multiply(ringFraction).add(beamCentre);
}
