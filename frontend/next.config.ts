import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/57E8HMCnGw",
        permanent: true,
      },
      {
        source: "/map",
        destination: "https://map.mountaineercraft.net",
        permanent: true,
      },
      {
        source: "/analytics",
        destination: "https://analytics.mountaineercraft.net",
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
