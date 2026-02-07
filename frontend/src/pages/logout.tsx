import { Box, Flex, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Remove JWT from storage
    sessionStorage.removeItem("auth_token");

    // Optionally remove other user info
    sessionStorage.removeItem("user");

    // Redirect to login or home
    router.replace("/login");
  }, [router]);

  
  return (
    <>
      <Head>
        <title>Logout - Mountaineer Craft</title>
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
        </Box>
      </Flex>
    </>
  );
}
