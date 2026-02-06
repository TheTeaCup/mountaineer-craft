import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import Head from "next/head";

export default function Login() {
  if (typeof window !== "undefined") {
    window.location.href = "https://discord.com/oauth2/authorize?client_id=1465494022150684769&response_type=code&redirect_uri=https%3A%2F%2Fmountaineercraft.net%2Foauth%2Fdiscord&scope=identify+guilds+email";
  }

  return (
    <>
      <Head>
        <title>Login - Mountaineer Craft</title>
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
            Redirecting you to Discord for authentication...
          </Heading>
        <Spinner color="colorPalette.600" colorPalette="yellow" size="lg"/>
        </Box>
      </Flex>
    </>
  );
}
