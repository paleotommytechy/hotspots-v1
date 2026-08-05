/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: [
    '@hotspots/types',
    '@hotspots/validation',
    '@hotspots/matching',
    '@hotspots/database',
    '@hotspots/design-tokens',
    '@hotspots/ui-web',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
