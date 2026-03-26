"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AggregatedStock } from "@/lib/apis/aggregator";
import PEGYBadge from "@/components/PEGYBadge";
import DataConfidenceBadge from "@/components/DataConfidenceBadge";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

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

function fmtMarketCap(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  return `$${n.toLocaleString()}`;
}

export default function StockDetailPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params?.ticker?.toUpperCase() ?? "";

  const { data: stock, error, isLoading } = useSWR<AggregatedStock>(
    ticker ? `/api/stocks/${ticker}` : null,
    fetcher,
    { refreshInterval: 60_000 }
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-8 w-32 animate-pulse rounded-full bg-white/[0.06] mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Markets
        </Link>
        <p className="text-red-400">
          {error?.message ?? "Stock not found."}
        </p>
      </div>
    );
  }

  const positive = stock.changePercent >= 0;

  // Bar chart data for OHLC
  const ohlcData = [
    { label: "Open", value: stock.priceOpen },
    { label: "High", value: stock.priceHigh },
    { label: "Low", value: stock.priceLow },
    { label: "Close", value: stock.price },
  ];

  // Key metrics table
  const metrics = [
    { label: "P/E Ratio", value: stock.pe !== null ? stock.pe.toFixed(2) : "—" },
    { label: "EPS", value: stock.eps !== null ? `$${stock.eps.toFixed(2)}` : "—" },
    {
      label: "EPS Growth (Annual)",
      value: stock.epsGrowthAnnual !== null ? `${stock.epsGrowthAnnual.toFixed(2)}%` : "—",
    },
    {
      label: "Dividend Yield",
      value: stock.dividendYield !== null ? `${stock.dividendYield.toFixed(2)}%` : "—",
    },
    { label: "Beta", value: stock.beta !== null ? stock.beta.toFixed(2) : "—" },
    { label: "Market Cap", value: fmtMarketCap(stock.marketCap) },
    {
      label: "52-Week High",
      value: stock.week52High !== null ? `$${fmt(stock.week52High)}` : "—",
    },
    {
      label: "52-Week Low",
      value: stock.week52Low !== null ? `$${fmt(stock.week52Low)}` : "—",
    },
    { label: "Previous Close", value: `$${fmt(stock.previousClose)}` },
    {
      label: "Volume",
      value: stock.volume > 0 ? Math.round(stock.volume).toLocaleString() : "—",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Markets
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-blue-400">
            {stock.ticker}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-white">{stock.name}</h1>
          {stock.sector && (
            <p className="text-sm text-gray-400">
              {stock.sector}
              {stock.industry ? ` — ${stock.industry}` : ""}
            </p>
          )}
        </div>
        <DataConfidenceBadge
          sources={stock.sources}
          discrepancy={stock.priceDiscrepancy}
        />
      </div>

      {/* Price hero */}
      <div className="mb-8 flex flex-wrap items-end gap-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-6 py-5">
        <div>
          <p className="text-4xl font-bold text-white">${fmt(stock.price)}</p>
          <p
            className={clsx(
              "mt-1 flex items-center gap-1 text-lg font-semibold",
              positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {positive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {positive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%
          </p>
        </div>
        <PEGYBadge pegy={stock.pegy} />
      </div>

      {/* OHLC Bar Chart */}
      <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
          Today&apos;s OHLC
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ohlcData} barGap={8}>
            <XAxis
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                color: "#fff",
              }}
              formatter={(v) => (v != null ? [`$${fmt(v as number)}`, ""] : ["-", ""])}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {ohlcData.map((entry, index) => (
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
      </div>

      {/* Fundamentals table */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-400">
          Fundamentals
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="mt-0.5 text-sm font-medium text-white">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <p className="mt-6 text-xs text-gray-400">
        Data from: {stock.sources.join(", ")}
        {stock.priceDiscrepancy && (
          <span className="text-amber-500/80">
            {" "}
            · Price discrepancy &gt;1% detected across sources
          </span>
        )}
      </p>
    </div>
  );
}
