import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse requires Node.js APIs not available in Edge runtime
  serverExternalPackages: ["pdf-parse", "mammoth"],
};

export default nextConfig;
