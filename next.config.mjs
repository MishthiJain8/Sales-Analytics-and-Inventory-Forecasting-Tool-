/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                net: false,
                tls: false,
                fs: false,
                dns: false,
            };
        }
        return config;
    },
};

export default nextConfig;
