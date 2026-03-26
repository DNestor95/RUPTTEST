"use client";

import type { StockQuote } from "@/app/lib/stocks";
import {
  formatCurrency,
  formatMarketCap,
  formatVolume,
} from "@/app/lib/stocks";

interface StockCardProps {
  stock: StockQuote;
}

export default function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.changePercent >= 0;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-gray-900">{stock.symbol}</span>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight max-w-[140px] truncate">
            {stock.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(stock.price)}
          </p>
          <p
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Change */}
      <div
        className={`text-xs px-2 py-0.5 rounded-full inline-block font-medium mb-3 ${
          isPositive
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {isPositive ? "+" : ""}
        {formatCurrency(stock.change)}
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
        <div>
          <span className="font-medium">Mkt Cap</span>
          <br />
          {formatMarketCap(stock.marketCap)}
        </div>
        <div>
          <span className="font-medium">Volume</span>
          <br />
          {formatVolume(stock.volume)}
        </div>
      </div>

      {/* Index badges */}
      <div className="flex gap-1 flex-wrap mt-3">
        {stock.indices.map((idx) => (
          <span
            key={idx}
            className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium uppercase"
          >
            {idx === "SP100" ? "S&P" : idx === "DOW30" ? "DOW" : "NDQ"}
          </span>
        ))}
      </div>
    </div>
  );
}
