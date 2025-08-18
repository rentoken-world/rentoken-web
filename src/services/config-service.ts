/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-18 09:18:58
 * @FilePath: /keke-frontend/src/services/config-service.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
// 导出默认的配置服务类，用于管理应用程序的配置信息
export default class ConfigService {
    // 私有静态方法，用于获取环境变量值，如果环境变量不存在则返回默认值
    private static getEnvVar(key: string, defaultValue: string): string {
        // 从 process.env 中获取指定键的环境变量值
        const value = process.env[key];
        // 如果环境变量值不存在
        if (!value) {
            // 在控制台输出警告信息，提示环境变量未设置，将使用默认值
            console.warn(`Environment variable ${key} is not set, using default value`);
            // 返回默认值
            return defaultValue;
        }
        // 返回环境变量的值
        return value;
    }

    // 静态属性：认证消息模板，用于用户签名认证
    static AUTH_MSG: string = ConfigService.getEnvVar(
        'AUTH_MSG', // 环境变量键名
        'Sign this message to authenticate with Poseidon Pay: <timestamp>' // 默认的认证消息模板
    );

    // 静态属性：Poseidon Pay 智能合约地址
    static POSEIDON_PAY_CONTRACT: string = ConfigService.getEnvVar(
        'POSEIDON_PAY_CONTRACT', // 环境变量键名
        '0x0000000000000000000000000000000000000000' // 默认的合约地址（零地址）
    );

    // 静态属性：后端 API 服务器的 URL 地址
    static BACKEND_URL: string = ConfigService.getEnvVar(
        'BACKEND_URL', // 环境变量键名
        'http://localhost:3001/api' // 使用Next.js API Routes
    );

    // 静态方法：生成带有时间戳的认证消息
    static getAuthMessage(): string {
        // 检查认证消息模板是否包含时间戳占位符
        if (!ConfigService.AUTH_MSG.includes('<timestamp>')) {
            // 如果没有时间戳占位符，抛出错误
            throw new Error('Auth message must have a timestamp placeholder');
        }
        // 将认证消息模板中的 <timestamp> 占位符替换为当前时间戳，并返回
        return ConfigService.AUTH_MSG.replace('<timestamp>', Date.now().toString());
    }
}