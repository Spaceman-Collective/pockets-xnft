/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
