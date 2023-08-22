import { Box, Card, CardContent } from "@mui/material";
import { VisCanvas, Pan, Zoom } from '@h5web/lib';

export default function CentrePlot(): JSX.Element {
    return (
        <Box>
            <Card>
                <CardContent>
                    <div style={{ display: "grid", height: "60vh", width: "50vw" }}>
                        <VisCanvas
                            abscissaConfig={{
                                isIndexAxis: true,
                                showGrid: true,
                                visDomain: [
                                    50,
                                    100
                                ]
                            }}
                            aspect={{}}
                            ordinateConfig={{
                                isIndexAxis: true,
                                showGrid: true,
                                visDomain: [
                                    50,
                                    100
                                ]
                            }}
                            showAxes={true}
                        >
                            <Pan
                                button={[
                                    0
                                ]}
                                modifierKey={[]}
                            />
                            <Zoom />
                            {/*<f />*/}
                        </VisCanvas>
                    </div>
                </CardContent>
            </Card>
        </Box >)
}