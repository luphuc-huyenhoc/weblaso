/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  async rewrites() {
    return [
      {
        source: '/lich-am-duong',
        destination: '/la-so-tu-vi/lich-am-duong',
      },
      {
        source: '/doi-lich-am-duong',
        destination: '/la-so-tu-vi/doi-lich-am-duong',
      },
    ];
  },
};

export default nextConfig;
