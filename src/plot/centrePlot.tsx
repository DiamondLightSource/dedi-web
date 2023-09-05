import { Box, Card, CardContent } from "@mui/material";
import {
  DataToHtml,
  DefaultInteractions,
  ResetZoomButton,
  SvgCircle,
  SvgRect,
  SvgLine,
  SvgElement,
  VisCanvas,
} from "@h5web/lib"
import { Vector3 } from "three";


export default function CentrePlot(): JSX.Element {
  return (
    <Box>
      <Card>
        <CardContent>
          <div style={{ display: "grid", height: "60vh", width: "50vw", border: "solid black" }}>
            <VisCanvas
              style={{ padding: "5px 5px 5px" }}
              abscissaConfig={{ visDomain: [0, 10], showGrid: true }}
              ordinateConfig={{ visDomain: [0, 10], showGrid: true }}
            >
              <DefaultInteractions />
              <ResetZoomButton />
              <DataToHtml
                points={[
                  new Vector3(2, 8),
                  new Vector3(4, 6),
                  new Vector3(3, 2),
                  new Vector3(6, 4),
                  new Vector3(6, 6),
                  new Vector3(7, 7),
                ]}
              >
                {(pt1: Vector3, pt2: Vector3, pt3: Vector3, pt4: Vector3, pt5: Vector3, pt6: Vector3) => (
                  <SvgElement>
                    <SvgRect coords={[pt1, pt2]} fill="" />
                    <SvgLine
                      coords={[pt3, pt4]}
                      stroke="darkblue"
                      strokeWidth={5}
                      strokeLinecap="round"
                    />
                    <SvgRect
                      coords={[pt5, pt6]}
                      fill="none"
                      stroke="teal"
                      strokeWidth={10}
                      strokePosition="outside"
                    />
                    <SvgCircle coords={[pt5, pt6]} fill="none" stroke="lightseagreen" />
                  </SvgElement>
                )}
              </DataToHtml>
            </VisCanvas>
          </div>
        </CardContent>
      </Card>
    </Box >
  );
}