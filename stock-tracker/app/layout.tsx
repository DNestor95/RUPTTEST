import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Auth0Provider from "@/components/Auth0Provider";

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
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white" style={{ background: "var(--surface-base)" }}>
        <Auth0Provider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-8 text-center text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
            BlueTracker — Data provided by Finnhub, Alpha Vantage &amp; Polygon.io.
            Not financial advice.
          </footer>
        </Auth0Provider>
      </body>
    </html>
  );
}
