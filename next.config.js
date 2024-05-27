/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')()
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
 
module.exports = 
  process.env.ANALYZE === 'true' ? withBundleAnalyzer(withNextIntl(nextConfig)) : withNextIntl(nextConfig);

