"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StockTable from "@/app/components/StockTable";
import type { StockQuote } from "@/app/lib/stocks";
import {
  getBiggestMovers,
  getCrossReferencedMovers,
} from "@/app/lib/stocks";
import { ALL_SYMBOLS } from "@/app/lib/stocks-data";

type Tab = "all" | "sp100" | "dow30" | "nasdaq100" | "movers" | "cross";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("movers");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ symbols: ALL_SYMBOLS.join(",") });
        const res = await fetch(`/api/stocks?${params}`);
        if (!res.ok) throw new Error("API error");
        const data: StockQuote[] = await res.json();
        setQuotes(data);
        setLastUpdated(new Date());
      } catch {
        setError("Failed to load stock data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg animate-pulse">Loading…</div>
      </div>
    );
  }

  const filteredQuotes: Record<Tab, StockQuote[]> = {
    all: quotes,
    sp100: quotes.filter((q) => q.indices.includes("SP100")),
    dow30: quotes.filter((q) => q.indices.includes("DOW30")),
    nasdaq100: quotes.filter((q) => q.indices.includes("NASDAQ100")),
    movers: getBiggestMovers(quotes, 20),
    cross: getCrossReferencedMovers(quotes, 2, 20),
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "movers", label: "Biggest Movers" },
    { key: "cross", label: "Cross-Index" },
    { key: "sp100", label: "S&P 100" },
    { key: "dow30", label: "Dow Jones 30" },
    { key: "nasdaq100", label: "Nasdaq 100" },
    { key: "all", label: "All Stocks" },
  ];

  const tableTitle: Record<Tab, string> = {
    all: "All Tracked Stocks",
    sp100: "S&P 100 Stocks",
    dow30: "Dow Jones 30 Stocks",
    nasdaq100: "Nasdaq 100 Stocks",
    movers: "Biggest Movers Today",
    cross: "Cross-Referenced Movers (2+ Indices)",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back,{" "}
            <strong>{session?.user?.name ?? session?.user?.email}</strong>
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          {lastUpdated && (
            <>
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString()}
              <br />
            </>
          )}
          Auto-refreshes every 60s
        </div>
      </div>

      {/* Summary cards */}
      {quotes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Stocks",
              value: quotes.length,
              color: "blue",
            },
            {
              label: "Gainers",
              value: quotes.filter((q) => q.changePercent > 0).length,
              color: "green",
            },
            {
              label: "Losers",
              value: quotes.filter((q) => q.changePercent < 0).length,
              color: "red",
            },
            {
              label: "Cross-Index",
              value: getCrossReferencedMovers(quotes, 2).length,
              color: "purple",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px ${
              activeTab === tab.key
                ? "bg-white border border-b-white border-gray-200 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({filteredQuotes[tab.key].length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 animate-pulse">
            Loading stock data…
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
          {error}
        </div>
      ) : (
        <StockTable
          stocks={filteredQuotes[activeTab]}
          title={tableTitle[activeTab]}
        />
      )}
    </div>
  );
}
