"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { AggregatedStock } from "@/lib/apis/aggregator";
import StockGrid from "@/components/StockGrid";
import ThresholdSlider from "@/components/ThresholdSlider";
import { TrendingUp, RefreshCw, Activity } from "lucide-react";

const THRESHOLD_KEY = "bluepulse_threshold";
const DEFAULT_THRESHOLD = 5;

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

  const gainers = movers.filter(s => s.changePercent >= 0).length;
  const losers = movers.filter(s => s.changePercent < 0).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Hero ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-widest"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.25)",
            color: "#60a5fa",
          }}
        >
          <Activity className="h-3 w-3" />
          Live Markets
        </div>

        <h1
          className="text-4xl font-bold sm:text-5xl leading-[1.1] tracking-tight"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          Today&apos;s{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Major Moves
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Tracking{" "}<span style={{ color: "var(--text-primary)", fontWeight: 600 }}>&gt;200 blue chip stocks</span>{" "}
          across the Dow Jones 30, S&amp;P 500 top 100, and NASDAQ top 100.
          Prices cross-referenced from Finnhub, Alpha Vantage, and Polygon.
        </p>

        {/* Live stat pills */}
        {!isLoading && movers.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.25)",
                color: "#34d399",
              }}
            >
              <TrendingUp className="h-3 w-3" />
              {gainers} Gaining
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.25)",
                color: "#f87171",
              }}
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              {losers} Falling
            </span>
          </div>
        )}
      </div>

      {/* Controls ─────────────────────────────────────────────────────── */}
      <div
        className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <ThresholdSlider value={threshold} onChange={handleThresholdChange} />
        <div className="flex items-center gap-4">
          {fetchedAt && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Updated {fetchedAt}
            </span>
          )}
          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition-all duration-150 disabled:opacity-50"
            style={{
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--border-focus)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--surface-raised)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div
          className="mb-6 rounded-2xl px-5 py-4 text-sm"
          style={{
            background: "rgba(248,113,113,0.05)",
            border: "1px solid rgba(248,113,113,0.2)",
            color: "#f87171",
          }}
        >
          Failed to load stock data. Check your API keys in{" "}
          <code
            className="rounded px-1 py-0.5 text-xs font-mono"
            style={{ background: "rgba(248,113,113,0.12)", color: "#fca5a5" }}
          >
            .env.local
          </code>{" "}
          and try again.
        </div>
      )}

      {/* Content ────────────────────────────────────────────────────────── */}
      {isLoading && !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl skeleton"
              style={{ border: "1px solid var(--border-subtle)" }}
            />
          ))}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{movers.length}</span>
            {" "}stock{movers.length !== 1 ? "s" : ""} moved ≥{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{threshold.toFixed(1)}%</span> today
          </p>
          <StockGrid stocks={movers} />
        </>
      )}
    </div>
  );
}
