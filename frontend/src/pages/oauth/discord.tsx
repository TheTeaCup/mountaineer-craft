import { Flex, Box, Heading, Spinner } from "@chakra-ui/react";
import Head from "next/head";

export default function OAuthDiscord() {
  return (
    <>
      <Head>
        <title>OAuth - Mountaineer Craft</title>
      </Head>

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
          <Heading fontSize={{ base: "xl", md: "3xl" }} mb={4}>
            Welcome back!
          </Heading>
        </Box>
      </Flex>
    </>
  );
}
