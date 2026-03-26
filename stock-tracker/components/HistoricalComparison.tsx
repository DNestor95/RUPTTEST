"use client";

import useSWR from "swr";
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface HistoricalDayData {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  changePercent: number;
}

interface Props {
  ticker: string;
  currentPrice: number;
  currentOpen: number;
  currentHigh: number;
  currentLow: number;
  currentVolume: number;
  currentChangePercent: number;
}

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch");
    return r.json();
  });

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function OhlcChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barGap={8}>
        <XAxis
          dataKey="label"
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fill: "#9ca3af", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v as number).toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "#fff",
          }}
          formatter={(v) =>
            v != null ? [`$${fmt(v as number)}`, ""] : ["-", ""]
          }
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.label === "High"
                  ? "#34d399"
                  : entry.label === "Low"
                  ? "#f87171"
                  : "#3b82f6"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function HistoricalComparison({
  ticker,
  currentPrice,
  currentOpen,
  currentHigh,
  currentLow,
  currentVolume,
  currentChangePercent,
}: Props) {
  const { data: historical, error, isLoading } = useSWR<HistoricalDayData>(
    `/api/stocks/${ticker}/history`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const currentOhlc = [
    { label: "Open", value: currentOpen },
    { label: "High", value: currentHigh },
    { label: "Low", value: currentLow },
    { label: "Close", value: currentPrice },
  ];

  const historicalOhlc = historical
    ? [
        { label: "Open", value: historical.open },
        { label: "High", value: historical.high },
        { label: "Low", value: historical.low },
        { label: "Close", value: historical.price },
      ]
    : [];

  const priceChange =
    historical != null
      ? ((currentPrice - historical.price) / historical.price) * 100
      : null;

  return (
    <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-400">
          Year-over-Year Comparison
        </h2>
        {priceChange !== null && (
          <span
            className={clsx(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
              priceChange >= 0
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            )}
          >
            {priceChange >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}% vs 1 year ago
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Current day */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Today
            </p>
            <span
              className={clsx(
                "flex items-center gap-1 text-sm font-semibold",
                currentChangePercent >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {currentChangePercent >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {currentChangePercent >= 0 ? "+" : ""}
              {currentChangePercent.toFixed(2)}%
            </span>
          </div>
          <p className="mb-3 text-2xl font-bold text-white">${fmt(currentPrice)}</p>
          <OhlcChart data={currentOhlc} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500">Open</p>
              <p className="font-medium text-white">${fmt(currentOpen)}</p>
            </div>
            <div>
              <p className="text-gray-500">High</p>
              <p className="font-medium text-emerald-400">${fmt(currentHigh)}</p>
            </div>
            <div>
              <p className="text-gray-500">Low</p>
              <p className="font-medium text-red-400">${fmt(currentLow)}</p>
            </div>
            <div>
              <p className="text-gray-500">Volume</p>
              <p className="font-medium text-white">
                {currentVolume > 0
                  ? Math.round(currentVolume).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* 1 year ago */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded-full bg-white/[0.06]" />
              <div className="h-8 w-32 animate-pulse rounded-full bg-white/[0.04]" />
              <div className="h-40 animate-pulse rounded-xl bg-white/[0.04]" />
            </div>
          ) : error || !historical ? (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <p className="text-sm text-gray-500">
                Historical data unavailable
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  1 Year Ago
                </p>
                <span className="text-xs text-gray-500">{historical.date}</span>
              </div>
              <div className="mb-3 flex items-end gap-2">
                <p className="text-2xl font-bold text-white">
                  ${fmt(historical.price)}
                </p>
                <span
                  className={clsx(
                    "mb-0.5 flex items-center gap-1 text-sm font-semibold",
                    historical.changePercent >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  )}
                >
                  {historical.changePercent >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {historical.changePercent >= 0 ? "+" : ""}
                  {historical.changePercent.toFixed(2)}%
                </span>
              </div>
              <OhlcChart data={historicalOhlc} />
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Open</p>
                  <p className="font-medium text-white">${fmt(historical.open)}</p>
                </div>
                <div>
                  <p className="text-gray-500">High</p>
                  <p className="font-medium text-emerald-400">
                    ${fmt(historical.high)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Low</p>
                  <p className="font-medium text-red-400">
                    ${fmt(historical.low)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Volume</p>
                  <p className="font-medium text-white">
                    {historical.volume > 0
                      ? Math.round(historical.volume).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
