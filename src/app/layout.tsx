import type { Metadata } from "next";
import "../styles/globals.css";
import AntdConfigProvider from "@/components/AntdRegistry";

export const metadata: Metadata = {
  title: "RenToken.World - 房租收益RWA平台",
  description: "致力于将真实世界的房租收益资产(RWA)引入区块链，实现房产租金收益的数字化、透明化和可交易化",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <AntdConfigProvider>
          {children}
        </AntdConfigProvider>
      </body>
    </html>
  );
}
