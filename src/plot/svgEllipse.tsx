import type { SVGProps } from "react";
import { Vector3 } from "three";

type Rect = [Vector3, Vector3, Vector3];

interface Props extends SVGProps<SVGEllipseElement> {
  coords: Rect;
}

function SvgAxisAlignedEllipse(props: Props): React.JSX.Element | null {
  const { coords, ...svgProps } = props;

  const [start, endx, endy] = coords;
  const rx = endx.distanceTo(start);
  const ry = endy.distanceTo(start);

  if (
    !isFinite(rx) ||
    !isFinite(ry) ||
    !isFinite(start.x) ||
    !isFinite(start.y)
  )
    return null;

  return <ellipse cx={start.x} cy={start.y} rx={rx} ry={ry} {...svgProps} />;
}

export type { Props as SvgAxisAlignedEllipseProps };
export default SvgAxisAlignedEllipse;
