import { Box, Card, CardContent, Stack, Typography, } from "@mui/material";

export default function CentrePlot(): JSX.Element {
    return (
        <Box sx={{ flexGrow: 2 }} >
            <Card sx={{ height: 1 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h4"> Plot at the centre </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box >)
}