import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check if already logged in
    const token = sessionStorage.getItem("auth_token");

    if (token) {
      router.replace("/me");
      return;
    }

    // 2. Begin Discord OAuth
    const state = crypto.randomUUID();
    sessionStorage.setItem("discord_oauth_state", state);

    const params = new URLSearchParams({
      client_id: "1465494022150684769",
      response_type: "code",
      redirect_uri: "https://mountaineercraft.net/oauth/discord",
      scope: "identify guilds email",
      state,
    });

    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  }, [router]);

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
          <Spinner color="colorPalette.600" colorPalette="yellow" size="xl" />
          <br />
          <Heading fontSize={{ base: "xl", md: "3xl" }} mb={4}>
            Redirecting you to Discord for authentication...
          </Heading>
        </Box>
      </Flex>
    </>
  );
}
