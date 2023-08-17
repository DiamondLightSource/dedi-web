import { Box, Card, CardContent, Stack, Typography, } from "@mui/material";

export default function DataSideBar(): JSX.Element {
    return (
        <Box sx={{ flexGrow: 2 }} >
            <Card sx={{ height: 1 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h4"> Home Page : And Quick guide </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box >)
}