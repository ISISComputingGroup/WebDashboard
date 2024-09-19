/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.isis.stfc.ac.uk',
        port: '',
        pathname: '/Gallery/beam-status/*',
      },
    ],
  }

};

export default nextConfig;
