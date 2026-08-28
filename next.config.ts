import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to allow Next.js API Routes / Nodemailer
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;