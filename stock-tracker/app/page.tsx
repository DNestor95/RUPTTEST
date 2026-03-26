"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { AggregatedStock } from "@/lib/apis/aggregator";
import StockGrid from "@/components/StockGrid";
import ThresholdSlider from "@/components/ThresholdSlider";
import { TrendingUp, RefreshCw } from "lucide-react";

const THRESHOLD_KEY = "bluepulse_threshold";
const DEFAULT_THRESHOLD = 3;

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch");
    return r.json();
  });

export default function HomePage() {
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);

  // Persist threshold to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(THRESHOLD_KEY);
    if (saved) setThreshold(parseFloat(saved));
  }, []);

  const handleThresholdChange = useCallback((val: number) => {
    setThreshold(val);
    localStorage.setItem(THRESHOLD_KEY, String(val));
  }, []);

  const { data, error, isLoading, mutate } = useSWR<{
    movers: AggregatedStock[];
    fetchedAt: string;
  }>(`/api/stocks?threshold=${threshold}&limit=60`, fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false,
  });

  const movers = data?.movers ?? [];
  const fetchedAt = data?.fetchedAt
    ? new Date(data.fetchedAt).toLocaleTimeString()
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-blue-400 mb-3">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-widest">
            Blue Chip Movers
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Today&apos;s Major Moves
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl">
          Tracking {">"}200 blue chip stocks across the Dow Jones 30, S&amp;P
          500 top 100, and NASDAQ top 100. Prices cross-referenced from
          Finnhub, Alpha Vantage, and Polygon.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/8 bg-gray-900/50 px-5 py-4">
        <ThresholdSlider value={threshold} onChange={handleThresholdChange} />
        <div className="flex items-center gap-4">
          {fetchedAt && (
            <span className="text-xs text-gray-600">Updated {fetchedAt}</span>
          )}
          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* States */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/30 px-5 py-4 text-sm text-red-400">
          Failed to load stock data. Check your API keys in{" "}
          <code className="font-mono text-xs">.env.local</code> and try again.
        </div>
      )}

      {isLoading && !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-xl bg-gray-800/60"
            />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {movers.length} stock{movers.length !== 1 ? "s" : ""} moved ≥{" "}
            {threshold.toFixed(1)}% today
          </p>
          <StockGrid stocks={movers} />
        </>
      )}
    </div>
  );
}
