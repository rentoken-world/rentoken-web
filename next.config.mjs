/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["commons/*"],
    env: {
        AUTH_MSG: process.env.AUTH_MSG || 'Sign this message to authenticate with Poseidon Pay: <timestamp>',
        POSEIDON_PAY_CONTRACT: process.env.POSEIDON_PAY_CONTRACT || '0x0000000000000000000000000000000000000000',
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    }
};

export default nextConfig;
