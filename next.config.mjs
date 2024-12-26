/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Add environment variables
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default nextConfig;
