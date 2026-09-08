import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nazarel Qua",
  description: "Depot Air Minum Nazarel Qua - Kesegaran dan Kualitas dalam Setiap Tetesan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased selection:bg-gold-500/30 selection:text-ocean-900`}
      >
        {children}
      </body>
    </html>
  );
}
