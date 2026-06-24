import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteLoaderProvider } from "@/components/shared/SiteLoaderProvider";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ARORA LEMON — Natural Refreshment In Every Sip",
  description:
    "Crafted from fresh lemons, natural ingredients, and pure refreshment. Discover Classic Lemon, Lemon Mint, and Lemon Berry.",
  keywords: ["lemonade", "natural beverage", "ARORA LEMON", "refreshment"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-[#1a1a1a]">
        <SmoothScroll>
          <SiteLoaderProvider>{children}</SiteLoaderProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
