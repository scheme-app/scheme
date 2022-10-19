/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { images: { allowFutureImage: true } },
  images: {
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
