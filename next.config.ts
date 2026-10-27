import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Inlined at build time so client components see the same gym as the server.
  env: { TENANT: process.env.TENANT ?? "gold" },
};

export default nextConfig;
