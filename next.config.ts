import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // <--- This is the magic line that fixes the 403 error
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;