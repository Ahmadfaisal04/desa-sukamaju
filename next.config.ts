import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              img-src 'self' data: blob: https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://*.gstatic.com;
              frame-src 'self' https://www.google.com https://maps.google.com;
              connect-src 'self' https://maps.googleapis.com;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
