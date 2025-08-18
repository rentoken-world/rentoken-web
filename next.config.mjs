/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-18 10:53:04
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 14:46:09
 * @FilePath: /rentoken-web/next.config.mjs
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["commons/*"],
    images: {
        domains: ['images.unsplash.com'],
    },
    env: {
        AUTH_MSG: process.env.AUTH_MSG || 'Sign this message to authenticate with Poseidon Pay: <timestamp>',
        POSEIDON_PAY_CONTRACT: process.env.POSEIDON_PAY_CONTRACT || '0x0000000000000000000000000000000000000000',
        BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    }
};

export default nextConfig;
