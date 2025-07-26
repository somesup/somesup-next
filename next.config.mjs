/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', ...config.resolve.extensions];
    return config;
  },
};

export default nextConfig;
