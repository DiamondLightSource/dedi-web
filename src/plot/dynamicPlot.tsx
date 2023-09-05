import { useEffect, useRef } from "react";
import { useBeamstopStore } from "../data-entry/beamstopStore";
import { useCameraTubeStore } from "../data-entry/cameraTubeStore";
import { useDetectorStore } from "../data-entry/detectorStore";



export default function BeamlinePlot(): JSX.Element {
    const beamstop = useBeamstopStore();
    const cameraTube = useCameraTubeStore();
    const detector = useDetectorStore();

    const svgRef = useRef<SVGSVGElement>(null);
    const xAxisRef = useRef<SVGGElement>(null);
    const yAxisRef = useRef<SVGGElement>(null);

    useEffect(() => {
        console.log("changes have happend")
    }, [beamstop, cameraTube, detector])

    return (
        <div >
            <div>
                <svg ref={svgRef}>
                    <g ref={xAxisRef}></g>
                    <g ref={yAxisRef}></g>
                </svg>
            </div>
        </div>
    )
}