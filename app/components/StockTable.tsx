"use client";

import type { StockQuote } from "@/app/lib/stocks";
import {
  formatCurrency,
  formatMarketCap,
  formatVolume,
} from "@/app/lib/stocks";

interface StockTableProps {
  stocks: StockQuote[];
  title: string;
  emptyMessage?: string;
}

export default function StockTable({
  stocks,
  title,
  emptyMessage = "No stocks to display.",
}: StockTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      {stocks.length === 0 ? (
        <p className="text-gray-500 text-sm p-6">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Change</th>
                <th className="px-4 py-3 text-right">% Change</th>
                <th className="px-4 py-3 text-right">Mkt Cap</th>
                <th className="px-4 py-3 text-right">Volume</th>
                <th className="px-4 py-3 text-center">Indices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {stock.symbol}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">
                      {stock.name}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(stock.price)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(stock.change)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? "▲" : "▼"}{" "}
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {formatMarketCap(stock.marketCap)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {formatVolume(stock.volume)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {stock.indices.map((idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium uppercase"
                          >
                            {idx === "SP100"
                              ? "S&P"
                              : idx === "DOW30"
                              ? "DOW"
                              : "NDQ"}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
