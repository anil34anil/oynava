/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // GameMonetize / GameDistribution thumbnail CDN'leri
    remotePatterns: [
      { protocol: "https", hostname: "img.gamemonetize.com" },
      { protocol: "https", hostname: "img.gamemonetize.net" },
      { protocol: "https", hostname: "img.gamedistribution.com" },
      { protocol: "https", hostname: "img.gamepix.com" },
      { protocol: "https", hostname: "**.gamepix.com" },
      { protocol: "https", hostname: "static.playgama.com" },
      { protocol: "https", hostname: "**.playgama.com" },
      { protocol: "https", hostname: "**.gamemonetize.com" },
    ],
  },
};

export default nextConfig;
