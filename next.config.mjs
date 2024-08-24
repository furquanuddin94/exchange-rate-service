/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        env: process.env.NEXT_PUBLIC_VERCEL_ENV
    }
};

export default nextConfig;
