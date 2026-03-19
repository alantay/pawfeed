import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // For Google profile pics
        port: "",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "95sgzogheer7uh3m.public.blob.vercel-storage.com", // You'll need this for Vercel Blob later!
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
