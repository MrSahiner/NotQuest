import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import BottomNav from "@/components/BottomNav";
import SwRegister from "@/components/SwRegister";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import "./globals.css";

// Türkçe karakterleri içeren birleştirilmiş fontlar (videolardakiyle aynı)
const sg = localFont({
  src: [
    { path: "./fonts/sg500.ttf", weight: "500" },
    { path: "./fonts/sg700.ttf", weight: "700" },
  ],
  variable: "--font-sg",
  display: "swap",
});

const jb = localFont({
  src: "./fonts/jb500.ttf",
  weight: "500",
  variable: "--font-jb",
  display: "swap",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_TAGLINE,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0d0e1a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${sg.variable} ${jb.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <main className="mx-auto min-h-dvh max-w-md px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-28">
          {children}
        </main>
        <BottomNav />
        <SwRegister />
      </body>
    </html>
  );
}
