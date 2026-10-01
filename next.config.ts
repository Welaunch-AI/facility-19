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
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/start", destination: "/", permanent: false },
      { source: "/onboarding", destination: "/", permanent: false },
      { source: "/workspaces/:path*", destination: "/", permanent: false },
      { source: "/auth/:path*", destination: "/", permanent: false },
    ];
  },
  async rewrites() {
    return [{ source: "/", destination: "/facility/index.html" }];
  },
};

export default nextConfig;
