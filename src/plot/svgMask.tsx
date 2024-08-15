import { SvgRect } from '@h5web/lib';
import type { SVGProps } from 'react';
import { Vector3 } from 'three';

type Rect = [Vector3, Vector3];

interface Props extends SVGProps<SVGPathElement> {
    coords: Rect;
    strokePosition?: 'inside' | 'outside';
    strokeWidth?: number;
    numModules: Vector3,
    gapFraction: Vector3, 
    missingSegments: number[]
}

function SvgMask(props: Props){
    // watch out some crazy insane big boy maths is incoming
    const [detectorUpper, detectorLower] = props.coords;
    // check if clone is needed later on
    const fulllength = detectorLower.clone().sub(detectorUpper);
    const gaplength = fulllength.clone().multiply(props.gapFraction);
    const moduleLength = 
        fulllength.clone()
        .sub(gaplength.clone()
        .multiply(props.numModules.clone().subScalar(1)))
        .divide(props.numModules);

    return (
    <>
        {/* plot vertical stripes */}
        {[...Array(props.numModules.x -1).keys()].map((i:number) =>         
        <SvgRect
            key={i}
            coords={
                generateVerticalStripes(
                    props.coords,
                    moduleLength.x,
                    gaplength.x,
                    i+1)
                }
            fill={props.fill}
            id="mask"
        />)
        }
        {/* plot horizontal stripes */}
        {[...Array(props.numModules.y -1).keys()].map((i:number) =>         
        <SvgRect
            key={i}
            coords={
                generateHorizontalStripes(
                    props.coords,
                    moduleLength.y,
                    gaplength.y,
                    i+1)
                }
            fill={props.fill}
            id="mask"
        />)
        }
    </>
    )
}

export type {Props as SvgMaskProps};
export default SvgMask;



function generateLowerBound(
    moduleLen: number, gapLen:number, moduleNum: number): number{
    return moduleNum*moduleLen + (moduleNum-1)*gapLen
}

function generateUpperBound(
    moduleLen: number, gapLen:number, moduleNum: number): number{
    return moduleNum*moduleLen + moduleNum*gapLen
}

function generateVerticalStripes(
    coords: Rect,
    moduleLenX: number,
    gapLenX: number,
    moduleNum: number): Rect{
    return [
        new Vector3(
            coords[0].x + generateLowerBound(moduleLenX, gapLenX, moduleNum),
            coords[0].y),
        new Vector3(
            coords[0].x + generateUpperBound(moduleLenX, gapLenX, moduleNum),
            coords[1].y)
    ]
}

function generateHorizontalStripes(
    coords: Rect,
    moduleLenY: number,
    gapLenY: number,
    moduleNum: number): Rect{
    return [
        new Vector3(coords[0].x, 
            coords[0].y + generateLowerBound(moduleLenY, gapLenY, moduleNum)),
        new Vector3(coords[1].x, 
            coords[0].y + generateUpperBound(moduleLenY, gapLenY, moduleNum))
    ]
}