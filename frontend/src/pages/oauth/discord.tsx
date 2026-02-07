import { Flex, Box, Heading, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function OAuthDiscord() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { code, state } = router.query;

    if (!code || typeof code !== "string") {
      setMessage("Missing Discord authorization code.");
      setError(true);
      return;
    }

    const storedState = sessionStorage.getItem("discord_oauth_state");
    if (storedState && state !== storedState) {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
    }

    // Call API
    fetch("https://api.mountaineercraft.net/auth/discord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg = data?.error || "Authentication failed";
          setMessage(msg);
          setError(true);
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        // Store JWT token in sessionStorage or localStorage
        if (data.token) {
          sessionStorage.setItem("auth_token", data.token);
        }

        setMessage("Login successful! Redirecting...");
        setTimeout(() => router.push("/me"), 1500);
      })
      .catch(() => {
        setMessage("Discord authentication failed.");
        setError(true);
      });
  }, [router.isReady, router.query, router]);

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
            {!message && (
              <>
                <br />
                <Spinner
                  color="colorPalette.600"
                  colorPalette="yellow"
                  size="xl"
                  ml={4}
                />
                <br />
                <br />
              </>
            )}
            {message || "Processing your Discord authentication..."}
            {error && (
              <>
                <br />
                <Box mt={5} color="red.500">
                  Click{" "}
                  <a href="/login" style={{ textDecoration: "underline" }}>
                    here
                  </a>{" "}
                  to try again.
                </Box>
              </>
            )}
          </Heading>
        </Box>
      </Flex>
    </>
  );
}
