import { Box, Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <>
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.900"
        color="white"
        px={6}
        textAlign="center"
      >
        <Box>
          <Spinner color="colorPalette.600" colorPalette="yellow" size="lg" />
        </Box>
      </Flex>
    </>
  );
}
