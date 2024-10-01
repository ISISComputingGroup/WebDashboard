/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",
  basePath: "/WebDashboard",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.isis.stfc.ac.uk',
        port: '',
        pathname: '/Gallery/beam-status/*',
      },
    ],
    unoptimized: true,
  }
};

export default nextConfig;
