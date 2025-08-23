/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2025-08-20 17:26:56
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2025-08-20 23:37:37
 * @FilePath: /rentoken-web/src/components/Providers.tsx
 * @Description: 
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
 */
"use client";

import '@rainbow-me/rainbowkit/styles.css';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from 'next-themes';
import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

// 自定义 RainbowKit 主题
const customDarkTheme = darkTheme({
  accentColor: 'hsl(330, 81%, 60%)', // 主要颜色 - 使用我们的主色
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

const customLightTheme = lightTheme({
  accentColor: 'hsl(330, 81%, 60%)', // 主要颜色 - 使用我们的主色
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  
  return (
    <RainbowKitProvider 
      theme={resolvedTheme === 'dark' ? customDarkTheme : customLightTheme}
      showRecentTransactions={true}
      coolMode
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* @ts-ignore - React 19 compatibility issue */}
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWrapper>
            {children}
          </RainbowKitWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
