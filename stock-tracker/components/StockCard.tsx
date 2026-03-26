import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AggregatedStock } from "@/lib/apis/aggregator";
import PEGYBadge from "./PEGYBadge";
import DataConfidenceBadge from "./DataConfidenceBadge";
import clsx from "clsx";

interface StockCardProps {
  stock: AggregatedStock;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtMarketCap(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

export default function StockCard({ stock }: StockCardProps) {
  const positive = stock.changePercent >= 0;

  return (
    <Link href={`/stock/${stock.ticker}`}>
      <div className="group relative flex flex-col gap-4 rounded-xl border border-white/8 bg-gray-900/60 p-5 backdrop-blur-sm transition-all hover:border-blue-500/40 hover:bg-gray-900/90 hover:shadow-lg hover:shadow-blue-900/20">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-blue-400">
              {stock.ticker}
            </span>
            <h3 className="mt-0.5 text-sm font-medium text-white line-clamp-1">
              {stock.name}
            </h3>
            {stock.sector && (
              <span className="text-xs text-gray-500">{stock.sector}</span>
            )}
          </div>
          <DataConfidenceBadge
            sources={stock.sources}
            discrepancy={stock.priceDiscrepancy}
          />
        </div>

        {/* Price + change */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">${fmt(stock.price)}</p>
            <p
              className={clsx(
                "flex items-center gap-1 text-sm font-semibold",
                positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {positive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {positive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%
            </p>
          </div>
          <PEGYBadge pegy={stock.pegy} className="items-end" />
        </div>

        {/* Fundamentals row */}
        <div className="grid grid-cols-3 gap-2 border-t border-white/6 pt-3 text-center">
          <div>
            <p className="text-xs text-gray-500">P/E</p>
            <p className="text-xs font-medium text-gray-200">
              {stock.pe !== null ? stock.pe.toFixed(1) : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Div Yield</p>
            <p className="text-xs font-medium text-gray-200">
              {stock.dividendYield !== null
                ? `${stock.dividendYield.toFixed(2)}%`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Mkt Cap</p>
            <p className="text-xs font-medium text-gray-200">
              {fmtMarketCap(stock.marketCap)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
