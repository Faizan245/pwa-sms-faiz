/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const pwaConfig = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === 'development', 
    workboxOptions: {
        disableDevLogs: true,
    },
});

const nextConfig = {
    distDir: '.next',
    images: {
        domains: ['example.com'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: '/_next/image',
        loader: 'default',
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.alias['@sentry/node'] = '@sentry/browser';
        }
        return config;
    },
    output: 'standalone',
};

export default pwaConfig(nextConfig);
