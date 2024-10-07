/** @type {import('next').NextConfig} */
const nextConfig = {
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
  basePath: "/WebDashboard",
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
