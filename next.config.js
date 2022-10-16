/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  dangerouslyAllowSVG: true,
  experimental: { images: { allowFutureImage: true } },
};

module.exports = nextConfig;
