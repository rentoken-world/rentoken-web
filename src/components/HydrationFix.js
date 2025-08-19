"use client";

import { useEffect } from 'react';

// 客户端组件来处理浏览器扩展引起的 hydration 问题
export function HydrationFix() {
  useEffect(() => {
    // 在开发环境中，抑制由浏览器扩展引起的 hydration 警告
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        const errorMessage = args[0]?.toString() || '';
        
        // 过滤掉由 youmind 扩展或其他浏览器扩展引起的 hydration 错误
        if (
          errorMessage.includes('youmind') ||
          errorMessage.includes('extension') ||
          errorMessage.includes('Text content does not match server-rendered HTML') ||
          errorMessage.includes('Hydration failed because the initial UI does not match')
        ) {
          return; // 忽略这些错误
        }
        
        // 其他错误正常显示
        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}
