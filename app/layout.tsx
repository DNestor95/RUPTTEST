import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Providers from "@/app/components/Providers";

export const metadata: Metadata = {
  title: "StockTracker – Blue Chip Stock Monitor",
  description:
    "Track blue chip stocks from the S&P 100, Dow Jones 30, and Nasdaq 100 in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-900 text-gray-400 text-center text-xs py-4">
            © {new Date().getFullYear()} StockTracker · Data is for informational
            purposes only. Not financial advice.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
