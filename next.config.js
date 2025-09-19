/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['4cdb39fc96619271522ab6d0b5cb7df6.r2.cloudflarestorage.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.r2.cloudflarestorage.com',
                port: '',
                pathname: '/*',
            },
        ],
    },
};

module.exports = nextConfig;