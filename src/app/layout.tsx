import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Achmad Taufiqur Rachman — Full Stack Engineer & Tech Researcher",
  description:
    "Portfolio of Achmad Taufiqur Rachman — Full Stack Engineer, GIS Researcher, and builder at SMAN 1 Giri. Featuring IJEN-CARE, Smart-Node Logistics, and empirical data research.",
};

export const viewport: Viewport = {
  themeColor: "#06070a",
};

import { HudOverlay } from "@/components/layout/HudOverlay";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${sans.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-white selection:text-black"
        suppressHydrationWarning
      >
        <HudOverlay />
        {children}
      </body>
    </html>
  );
}
