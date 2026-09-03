/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // The app runs fully in Mock Mode without a database or any external API key.
  env: {
    APP_NAME: "LAND LANGUAGE — AI REAL ESTATE BRIEF",
  },
};

export default nextConfig;
