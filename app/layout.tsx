import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "regenerator-runtime/runtime";
import I18nProvider from "@/components/I18nProvider";
import FarmingBackground from "@/components/FarmingBackground";
import MitraMascot from "@/components/MitraMascot";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://krishi-mitra.vercel.app'),
  title: "Krishi Mitra • Your Intelligent Farming Companion",
  description: "Multilingual AI agricultural advisor & operating system for Indian farmers",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Krishi Mitra • Your Intelligent Farming Companion",
    description: "Multilingual AI agricultural advisor & operating system for Indian farmers",
    images: [{ url: "/og.webp", width: 1200, height: 630, alt: "Krishi Mitra" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16a34a",
};

import FarmerInfoFooter from "@/components/FarmerInfoFooter";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={`${jakarta.className} bg-[#F8FAF7] text-[#111827] antialiased selection:bg-emerald-500/20 selection:text-emerald-900 min-h-screen relative`}>
        <FarmingBackground />
        <AuthProvider>
          <I18nProvider>
            {children}
            <FarmerInfoFooter />
            <MitraMascot mode="floating" />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
