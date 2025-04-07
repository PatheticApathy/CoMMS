import type { NextConfig } from "next";

module.exports = {
  async rewrites() {

    const api_host = process.env.API;
    return [
      {
        source: '/api/:path*',
        destination: `http://${api_host}/:path*`
      }
    ]
  },
  output: 'standalone',
};
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
