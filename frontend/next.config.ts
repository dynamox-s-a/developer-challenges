import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["storage.googleapis.com"],
  },
};

export default nextConfig;
