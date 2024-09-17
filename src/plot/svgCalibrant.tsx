import type { SVGProps } from "react";
import { Vector3 } from "three";
import SvgAxisAlignedEllipse from "./svgEllipse";
import { SvgLine } from "@h5web/lib";

export interface SvgCalibrantProps extends SVGProps<SVGEllipseElement> {
  beamCentre: Vector3;
  endPointX: Vector3;
  endPointY: Vector3;
  ringFractions: number[];
}

export default function SvgCalibrant(props: SvgCalibrantProps): JSX.Element {
  return (
    <>
      {[...Array(props.ringFractions.length).keys()].map((item: number) => (
        <SvgAxisAlignedEllipse
          {...props}
          key={item}
          coords={[
            props.beamCentre,
            getPointOnRing(
              props.beamCentre,
              props.endPointX,
              new Vector3(props.ringFractions[item], 1),
            ),
            getPointOnRing(
              props.beamCentre,
              props.endPointY,
              new Vector3(1, props.ringFractions[item]),
            ),
          ]}
        />
      ))}
      <SvgLine
        strokeWidth={props.strokeWidth}
        stroke={props.stroke}
        coords={[
          new Vector3(
            2 * props.beamCentre.x - props.endPointX.x,
            props.endPointX.y,
          ),
          props.endPointX,
        ]}
      />
    </>
  );
}

function getPointOnRing(
  beamCentre: Vector3,
  point: Vector3,
  ringFraction: Vector3,
): Vector3 {
  return point.clone().sub(beamCentre).multiply(ringFraction).add(beamCentre);
}
