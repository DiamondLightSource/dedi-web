import { Box, Card, CardContent, Stack, Typography, } from "@mui/material";

export default function DataSideBar(): JSX.Element {
    return (
        <Box sx={{ flexGrow: 1 }} >
            <Card sx={{ height: 1 }}>
                <CardContent>
                    <Stack spacing={1}>
                        <Typography variant="h4"> Configuration </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box >)
}