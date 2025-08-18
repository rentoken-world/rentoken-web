import { Sidebar } from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poseidon - Dashboard",
  description: "Trading bot platform dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex bg-slate-100 items-stretch">
        <Sidebar />
        {children}
    </div>
  );
}
