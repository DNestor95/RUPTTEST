import { STOCK_UNIVERSE } from "@/app/lib/stocks-data";
import type { StockQuote } from "@/app/lib/stocks";
import {
  getBiggestMovers,
  getCrossReferencedMovers,
  formatCurrency,
  formatMarketCap,
} from "@/app/lib/stocks";
import StockCard from "@/app/components/StockCard";
import Link from "next/link";

// Named constants for the mock price generation formula
const SEED_MULTIPLIER = 17;
const MILLISECONDS_PER_DAY = 86_400_000;
const NOISE_SCALE = 100;
const NOISE_OFFSET = 0.5;
const MAX_CHANGE_PERCENT = 5; // ±5% daily swing

// Generate server-side mock data (same logic as API route)
function generateServerQuote(
  symbol: string,
  name: string,
  indices: string[]
): StockQuote {
  const seed = symbol
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const basePrice = 50 + (seed % 950);
  const dailyNoise =
    ((seed * SEED_MULTIPLIER + Math.floor(Date.now() / MILLISECONDS_PER_DAY)) %
      NOISE_SCALE) /
      NOISE_SCALE -
    NOISE_OFFSET;
  const changePercent = parseFloat((dailyNoise * MAX_CHANGE_PERCENT * 2).toFixed(2));
  const price = parseFloat((basePrice * (1 + changePercent / 100)).toFixed(2));
  const change = parseFloat((price - basePrice).toFixed(2));
  const volume = Math.floor(1_000_000 + (seed % 50_000_000));
  const marketCap = Math.floor(
    price * (1_000_000_000 + (seed % 2_000_000_000_000))
  );

  return { symbol, name, price, change, changePercent, volume, marketCap, indices };
}

export default function Home() {
  const allQuotes: StockQuote[] = STOCK_UNIVERSE.map((s) =>
    generateServerQuote(s.symbol, s.name, s.indices as string[])
  );

  const biggestMovers = getBiggestMovers(allQuotes, 8);
  const crossReferenced = getCrossReferencedMovers(allQuotes, 2, 6);

  const topGainers = [...allQuotes]
    .filter((q) => q.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4);

  const topLosers = [...allQuotes]
    .filter((q) => q.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 4);

  const indexStats = [
    {
      label: "S&P 100",
      key: "SP100",
      color: "blue",
      count: STOCK_UNIVERSE.filter((s) => s.indices.includes("SP100")).length,
    },
    {
      label: "Dow Jones 30",
      key: "DOW30",
      color: "indigo",
      count: STOCK_UNIVERSE.filter((s) => s.indices.includes("DOW30")).length,
    },
    {
      label: "Nasdaq 100",
      key: "NASDAQ100",
      color: "purple",
      count: STOCK_UNIVERSE.filter((s) => s.indices.includes("NASDAQ100")).length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center py-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Blue Chip Stock Monitor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cross-reference the top stocks from the{" "}
          <strong>S&amp;P 100</strong>,{" "}
          <strong>Dow Jones 30</strong>, and{" "}
          <strong>Nasdaq 100</strong> to find the biggest movers.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            Sign In to Save Watchlist
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium px-6 py-2.5 rounded-full transition-colors"
          >
            View Full Dashboard
          </Link>
        </div>
      </section>

      {/* Index stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indexStats.map((idx) => {
          const indexQuotes = allQuotes.filter((q) => q.indices.includes(idx.key));
          const avgChange =
            indexQuotes.reduce((s, q) => s + q.changePercent, 0) /
            indexQuotes.length;
          const isUp = avgChange >= 0;
          return (
            <div
              key={idx.key}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{idx.label}</h3>
                <span
                  className={`text-sm font-bold ${
                    isUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isUp ? "▲" : "▼"} {Math.abs(avgChange).toFixed(2)}%
                </span>
              </div>
              <p className="text-xs text-gray-500">{idx.count} stocks tracked</p>
              <div className="mt-2 text-xs text-gray-400">
                Avg daily change: {isUp ? "+" : ""}{avgChange.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </section>

      {/* Biggest movers */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Biggest Movers Today
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {biggestMovers.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* Cross-referenced movers */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Cross-Index Movers
          </h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            Multi-Index
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          Stocks appearing in 2 or more indices — highly significant moves.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {crossReferenced.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </section>

      {/* Gainers & Losers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gainers */}
        <div>
          <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <span>▲</span> Top Gainers
          </h2>
          <div className="space-y-2">
            {topGainers.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-white rounded-lg border border-green-100 p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900">{stock.symbol}</span>
                  <span className="text-gray-500 text-xs ml-2 truncate max-w-[120px] inline-block align-middle">
                    {stock.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(stock.price)}</p>
                  <p className="text-green-600 text-sm font-medium">
                    +{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span>▼</span> Top Losers
          </h2>
          <div className="space-y-2">
            {topLosers.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-white rounded-lg border border-red-100 p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900">{stock.symbol}</span>
                  <span className="text-gray-500 text-xs ml-2 truncate max-w-[120px] inline-block align-middle">
                    {stock.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(stock.price)}</p>
                  <p className="text-red-600 text-sm font-medium">
                    {stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market cap leaders */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Market Cap Leaders
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...allQuotes]
            .sort((a, b) => b.marketCap - a.marketCap)
            .slice(0, 5)
            .map((stock) => (
              <div
                key={stock.symbol}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
              >
                <p className="font-bold text-gray-900 text-lg">{stock.symbol}</p>
                <p className="text-gray-500 text-xs truncate">{stock.name}</p>
                <p className="text-blue-600 font-semibold mt-2 text-sm">
                  {formatMarketCap(stock.marketCap)}
                </p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
