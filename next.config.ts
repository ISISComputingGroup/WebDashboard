import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: true,
      };
    }
    return config;
  },
  reactStrictMode: true,
  output: "export",
};

module.exports = nextConfig;
