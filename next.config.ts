import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: 'http://192.168.18.20:19000',
  },
};

export default nextConfig;
