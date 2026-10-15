import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Suspense } from "react"; // 1. Import Suspense
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";
import { HeaderShell } from "@/components/layout/header-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Klasiki", template: "%s — Klasiki" },
  description: "Handcrafted leather bags. Quiet luxury, made with care.",
  openGraph: {
    siteName: "Klasiki",
    type: "website",
    title: "Klasiki",
    description: "Handcrafted leather bags. Quiet luxury, made with care.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${display.variable} font-sans`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* 2. Wrap HeaderShell in Suspense */}
          <Suspense
            fallback={
              <div className="h-16 border-b border-border bg-background" />
            }
          >
            <HeaderShell />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
