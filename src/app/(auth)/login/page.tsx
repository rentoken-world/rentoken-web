/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-17 21:37:14
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-17 23:30:27
 * @FilePath: /auto_dex/frontend/src/app/(auth)/login/page.tsx
 * @Description: 房产RWA平台登录页面
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { Card, Button, Typography, Space, Avatar, Alert, Divider } from 'antd';
import { WalletOutlined, SafetyOutlined, HomeOutlined, DollarOutlined } from '@ant-design/icons';
import { doLogin } from '@/services/web3service';
import { Status } from "commons/models/status";

const { Title, Paragraph, Text } = Typography;

export default function Login() {
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const { push } = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            push("/dashboard");
        }
    }, [push]);

    async function handleWalletConnect() {
        setLoading(true);
        setMessage("正在连接钱包...");
        
        try {
            const jwt = await doLogin();
            if (!jwt) return;
            
            if (jwt.status === Status.ACTIVE) {
                push("/dashboard");
            } else if (jwt.status === Status.BLOCKED) {
                push(`/pay/${jwt.address}`);
            } else if (jwt.status === Status.NEW) {
                push(`/register/activate?wallet=${jwt.address}`);    
            } else if (jwt.status === Status.BANNED) {
                push('/login');
            } else {
                push('/register');
            }
        } catch (error) {
            setMessage((error as Error).message);   
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* 品牌Logo和标题 */}
                <div className="text-center mb-8">
                    <Avatar 
                        size={80} 
                        src="/img/poseidon_logo.png" 
                        className="mb-4 mx-auto"
                    />
                    <Title level={2} className="!mb-2 !text-slate-800">
                        RenToken.World
                    </Title>
                    <Paragraph className="!text-slate-600 !mb-0">
                        房租收益RWA投资平台
                    </Paragraph>
                </div>

                {/* 登录卡片 */}
                <Card 
                    className="shadow-lg border-0"
                    style={{ borderRadius: 16 }}
                >
                    <div className="text-center">
                        <Title level={4} className="!mb-4">
                            连接钱包开始投资
                        </Title>
                        
                        <Paragraph className="!text-slate-600 !mb-6">
                            通过链上租金收益凭证，轻松参与全球房产市场，享受稳定收益与资产流动性
                        </Paragraph>

                        {/* 特性亮点 */}
                        <Space direction="vertical" size="small" className="w-full mb-6">
                            <div className="flex items-center justify-start text-sm text-slate-600">
                                <SafetyOutlined className="mr-2 text-green-600" />
                                <span>区块链技术保障资产安全</span>
                            </div>
                            <div className="flex items-center justify-start text-sm text-slate-600">
                                <HomeOutlined className="mr-2 text-blue-600" />
                                <span>真实世界房产收益映射</span>
                            </div>
                            <div className="flex items-center justify-start text-sm text-slate-600">
                                <DollarOutlined className="mr-2 text-orange-600" />
                                <span>7×24小时随时交易流动</span>
                            </div>
                        </Space>

                        <Divider />

                        {/* 连接钱包按钮 */}
                        <Button
                            type="primary"
                            size="large"
                            icon={<WalletOutlined />}
                            loading={loading}
                            onClick={handleWalletConnect}
                            className="w-full h-14 font-medium text-base"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <Image 
                                src="/metamask.svg" 
                                alt="MetaMask" 
                                width={24} 
                                height={24} 
                                className="ml-2"
                            />
                            连接 MetaMask 钱包
                        </Button>

                        {/* 错误消息 */}
                        {message && (
                            <Alert
                                message={message}
                                type={message.includes('错误') || message.includes('失败') ? 'error' : 'info'}
                                showIcon
                                className="mt-4 text-left"
                            />
                        )}
                    </div>
                </Card>

                {/* 注册链接 */}
                <div className="text-center mt-6">
                    <Text className="text-slate-500">
                        没有账户？{' '}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            立即注册
                        </Link>
                    </Text>
                </div>

                {/* 底部信息 */}
                <div className="text-center mt-8 text-xs text-slate-400">
                    <p>© 2025 RenToken.World</p>
                    <p>专业的房产RWA投资平台</p>
                </div>
            </div>
        </div>
    );
}