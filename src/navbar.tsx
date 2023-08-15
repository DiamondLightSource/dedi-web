'use client'

import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Stack,
    useColorMode,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'


export default function Nav() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Flex bg={useColorModeValue('gray.100', 'gray.900')} style={{ height: '100%', position: 'absolute', width: '100%', left: '0px', overflow: 'hidden' }}>
            <Box>Logo</Box>
            <Box flexGrow={2} />
            <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                    <Button onClick={toggleColorMode}>
                        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}
