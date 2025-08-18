'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { rwaTheme } from '@/lib/antd-theme';

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

export default function AntdConfigProvider({ children }: AntdConfigProviderProps) {
  return (
    <AntdRegistry>
      <ConfigProvider 
        theme={rwaTheme}
        locale={zhCN}
        autoInsertSpaceInButton={false}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
