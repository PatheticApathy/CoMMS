import type { NextConfig } from "next";

const api_host = process.env.API;
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${api_host}/:path*`
      }
    ]
  }
};
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;