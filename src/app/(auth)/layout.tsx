import { AuthFooter } from "@/components/Auth/auth-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Poseidon",
  description: "Trading bot platform",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative w-full h-full min-h-screen">
        <div
        className="absolute top-0 w-full h-full bg-no-repeat bg-full inset-0"
        style={{
            backgroundImage: "url('/img/wave_pattern.png')",
            backgroundPosition: 'center',
            opacity: 0.1,
            backgroundSize: 'cover',      
        }}
        ></div>

        {children}
        <AuthFooter />
    </section>
  );
}
