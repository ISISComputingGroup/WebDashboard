import { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: "export",
	images: {
		unoptimized: true,
	},
};

module.exports = nextConfig;
