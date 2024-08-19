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
        />)
        }
        {/* plot horizontal stripes */}
        {[...Array(props.numModules.y -1).keys()].map((item:number) =>         
        <SvgRect
            key={item}
            coords={
                generateHorizontalStripes(
                    props.coords,
                    moduleLength.y,
                    gaplength.y,
                    item+1)
                }
            fill={props.fill}
        />)
        }
        {/* plot missing sections*/}
        {
            props.missingSegments.map((item: number) => 
            <SvgRect
            key={item}
            coords={generateMissingModule(
                props.coords,
                props.numModules,
                moduleLength,
                gaplength,
                item
            )}
            fill={props.fill}
            />
            )
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
    idx: number): Rect{
    return [
        new Vector3(
            coords[0].x + generateLowerBound(moduleLenX, gapLenX, idx),
            coords[0].y),
        new Vector3(
            coords[0].x + generateUpperBound(moduleLenX, gapLenX, idx),
            coords[1].y)
    ]
}

function generateHorizontalStripes(
    coords: Rect,
    moduleLenY: number,
    gapLenY: number,
    idx: number): Rect{
    return [
        new Vector3(coords[0].x, 
            coords[0].y + generateLowerBound(moduleLenY, gapLenY, idx)),
        new Vector3(coords[1].x, 
            coords[0].y + generateUpperBound(moduleLenY, gapLenY, idx))
    ]
}

function generateMissingModule(
    coords: Rect,
    moduleNum: Vector3,
    moduleLen: Vector3,
    gapLen: Vector3,
    idx: number): Rect{
    return [
            new Vector3(
                coords[0].x + (moduleLen.x + gapLen.x) *
                (idx % moduleNum.x),
                coords[0].y + (moduleLen.y + gapLen.y) *
                (Math.floor(idx / moduleNum.x))
            ),
            new Vector3(
                coords[0].x + (moduleLen.x + gapLen.x) *
                (idx % moduleNum.x) + moduleLen.x,
                coords[0].y + (moduleLen.y + gapLen.y) *
                (Math.floor(idx / moduleNum.x)) + moduleLen.y
            )
        ]
    }