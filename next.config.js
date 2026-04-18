/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3t3ozftmdmh3i.cloudfront.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        // /watch currently has no published content; route back to Subscribe
        // where video will eventually get its own section. 302 keeps it
        // reversible when video actually launches.
        source: "/watch",
        destination: "/subscribe",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
