import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  "include": [
    "material-api-types.d.ts",
    "nominatim-types.d.ts"
  ]
};

export default nextConfig;
