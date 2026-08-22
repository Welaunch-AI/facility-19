import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/legal/terms-of-service",
        permanent: true,
      },
      {
        source: "/legal/sms-policy",
        destination: "/sms-policy",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/", destination: "/facility/index.html" }];
  },
};

export default nextConfig;
