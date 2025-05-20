import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  // compress: false,
  // webpack(webpackConfig) {
  //   return {
  //     ...webpackConfig,
  //     optimization: {
  //       minimize: false,
  //     },
  //   };
  // },
};

module.exports = nextConfig;
