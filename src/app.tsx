import "./app.css";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";

function App(): JSX.Element {
  return (
    <Box>
      <VStack>
        <Box>App bar</Box>
        <Flex>
          <HStack>
            <Box h="100%" bg={"red"}>
              Side bar
            </Box>
            <Flex>
              <VStack>
                <Flex>
                  <HStack>
                    <Flex flexGrow={2} bg={"yellow"}>
                      Plot
                    </Flex>
                    <Box flexGrow={1}>plot legend</Box>
                  </HStack>
                </Flex>
                <Box bg={"green"} w={"100%"}>
                  {" "}
                  Results bar
                </Box>
              </VStack>
            </Flex>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
}

export default App;
