import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Auth0Provider from "@/components/Auth0Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlueTracker — Blue Chip Stock Tracker",
  description:
    "Track major moves in blue chip stocks across the Dow Jones, S&P 500, and NASDAQ with cross-referenced data from Finnhub, Alpha Vantage, and Polygon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-white">
        <Auth0Provider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-gray-400">
            BlueTracker — Data provided by Finnhub, Alpha Vantage &amp; Polygon.io.
            Not financial advice.
          </footer>
        </Auth0Provider>
      </body>
    </html>
  );
}
