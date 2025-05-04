import type { NextConfig } from "next";

module.exports = {
  async rewrites() {

    const api_host = process.env.API;
    const picture_host = process.env.PICTURES;
    return [
      {
        source: '/api/picture',
        destination: `http://${picture_host}/upload`
      },
      {
        source: '/uploads/:path*',
        destination: `http://${picture_host}/:path*`
      },
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
