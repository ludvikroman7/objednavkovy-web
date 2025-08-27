/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // nic jako appDir sem nedávej, Next 14 už jede app/ implicitně
  },
};
module.exports = nextConfig;
