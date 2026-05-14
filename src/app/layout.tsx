import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import SmoothScroll from "@/components/SmoothScroll";
import Script from "next/script";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "MOMENTUM // Protocol Access",
  description: "Expérience sensorielle compétitive 1v1. Lumière vs Ténèbres. Rhythm Parkour.",
  authors: [{ name: "Momentum Team" }],
  keywords: ["game", "momentum", "parkour", "rhythm", "multiplayer"],
  icons: {
    icon: "/logo.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <Script
          defer
          src="https://analytics.mmi23f03.fr/script.js"
          data-website-id="dea9c242-82b6-4100-a66b-ce7445c70d38"
        />
        <meta name="apple-mobile-web-app-title" content="Momentum" />
      </head>
      <body className="antialiased selection:bg-[#C0FE04] selection:text-black">
        <SmoothScroll />
        <Header />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
