import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [onlinePlayers, setOnlinePlayers] = useState<number | null>(null);

  const JAVA_ADDRESS = "play.mountaineercraft.net";
  const BEDROCK_ADDRESS = "bedrock.mountaineercraft.net";
  const BEDROCK_PORT = "19132";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toaster.create({
      title: `${label} copied!`,
      description: "Ready to paste into Minecraft",
      type: "success",
      duration: 2000,
    });
  };

  useEffect(() => {
    // Uses public API for Minecraft server status
    fetch(`https://api.mcsrvstat.us/2/${JAVA_ADDRESS}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.online) {
          setOnlinePlayers(data.players?.online ?? 0);
        } else {
          setOnlinePlayers(0);
        }
      })
      .catch(() => setOnlinePlayers(null));
  }, []);

  return (
    <>
      <Head>
        <title>Mountaineer Craft</title>
      </Head>
      <Toaster />
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
          <Heading fontSize={{ base: "3xl", md: "5xl" }} mb={4}>
            Welcome to Mountaineer Craft
          </Heading>

          <Text fontSize={{ base: "xl", md: "2xl" }} mb={8} color="gray.300">
            Our website is still under construction,
            <br />
            but the server is live — jump in!
          </Text>

          <VStack gap={6} mb={8}>
            <Box
              w="100%"
              maxW="md"
              borderWidth="1px"
              borderColor="gray.700"
              rounded="xl"
              px={4}
              py={3}
            >
              <HStack gap={3} justify="center" mb={2}>
                <Text fontWeight="medium" color="gray.300">
                  Java Edition
                </Text>
              </HStack>
              <HStack justify="center">
                <Badge colorPalette="yellow" size="lg">
                  {JAVA_ADDRESS}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(JAVA_ADDRESS, "Java address")}
                >
                  Copy
                </Button>
              </HStack>
            </Box>

            <Box
              w="100%"
              maxW="md"
              borderWidth="1px"
              borderColor="gray.700"
              rounded="xl"
              px={4}
              py={3}
            >
              <HStack gap={3} justify="center" mb={2}>
                <Text fontWeight="medium" color="gray.300">
                  Bedrock Edition
                </Text>
              </HStack>
              <HStack justify="center">
                <Badge colorPalette="yellow" size="lg">
                  {BEDROCK_ADDRESS}:{BEDROCK_PORT}
                </Badge>
                <Button
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `${BEDROCK_ADDRESS}:${BEDROCK_PORT}`,
                      "Bedrock address"
                    )
                  }
                >
                  Copy
                </Button>
              </HStack>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Console player? You can still join using{" "}
                <a
                  href="https://bedrocktogether.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  BedrockTogether
                </a>
                .
              </Text>
            </Box>
          </VStack>

          <VStack gap={4}>
            <Button size="lg">
              <a href={"https://links.mountaineercraft.net/discord"} target="_blank">
                Join our Discord
              </a>
            </Button>

            <Stack direction="row">
              <Button size="lg">
                <a href={"https://links.mountaineercraft.net/map"} target="_blank">
                  View Our Online Map
                </a>
              </Button>

              <Button size="lg">
                <a href={"https://links.mountaineercraft.net/analytics"} target="_blank">
                  Analytics Dashboard
                </a>
              </Button>
            </Stack>

            <Text color="gray.400">
              {onlinePlayers === null
                ? "Checking server status…"
                : `${onlinePlayers} player(s) online`}
            </Text>
          </VStack>
        </Box>
      </Flex>
    </>
  );
}
