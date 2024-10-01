/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.isis.stfc.ac.uk",
        port: "",
        pathname: "/Gallery/beam-status/*",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
