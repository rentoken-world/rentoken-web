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
