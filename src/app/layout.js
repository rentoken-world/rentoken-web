
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { I18nProvider } from "@/hooks/useI18n";
import { HydrationFix } from "@/components/HydrationFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RenToken - Real Estate Revenue Tokenization",
  description: "Tokenize rental property income. Invest in real estate revenue streams.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <HydrationFix />
        <I18nProvider>
          <Providers>
            <Navbar />
            <main className="min-h-[80vh] container mx-auto px-2 md:px-0">
              {children}
            </main>
            <Footer />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
