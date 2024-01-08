import { Stack, Typography, TypographyProps } from "@mui/material"

interface CentredTextProps extends TypographyProps {
    input: string
}

export default function CentredText(props: CentredTextProps): JSX.Element {
    return (
        <Stack>
            <Typography>{props.input}</Typography>
        </Stack>
    )
}