import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AggregatedStock } from "@/lib/apis/aggregator";
import PEGYBadge from "./PEGYBadge";
import DataConfidenceBadge from "./DataConfidenceBadge";

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
      <div
        className="group relative flex flex-col gap-0 rounded-2xl overflow-hidden transition-all duration-200"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
          boxShadow: positive
            ? "inset 3px 0 0 rgba(52,211,153,0.7), 0 2px 16px rgba(0,0,0,0.35)"
            : "inset 3px 0 0 rgba(248,113,113,0.7), 0 2px 16px rgba(0,0,0,0.35)",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.background = "var(--surface-hover)";
          el.style.borderColor = positive
            ? "rgba(52,211,153,0.35)"
            : "rgba(248,113,113,0.35)";
          el.style.boxShadow = positive
            ? "inset 3px 0 0 rgba(52,211,153,0.9), 0 8px 32px rgba(52,211,153,0.08), 0 4px 24px rgba(0,0,0,0.5)"
            : "inset 3px 0 0 rgba(248,113,113,0.9), 0 8px 32px rgba(248,113,113,0.08), 0 4px 24px rgba(0,0,0,0.5)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.background = "var(--surface-card)";
          el.style.borderColor = "var(--border-subtle)";
          el.style.boxShadow = positive
            ? "inset 3px 0 0 rgba(52,211,153,0.7), 0 2px 16px rgba(0,0,0,0.35)"
            : "inset 3px 0 0 rgba(248,113,113,0.7), 0 2px 16px rgba(0,0,0,0.35)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Card body */}
        <div className="flex flex-col gap-4 p-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <span
                className="text-xs font-bold tracking-widest"
                style={{ fontFamily: "var(--font-geist-mono)", color: "#60a5fa", letterSpacing: "0.12em" }}
              >
                {stock.ticker}
              </span>
              <h3 className="mt-0.5 text-sm font-medium leading-snug line-clamp-1" style={{ color: "var(--text-primary)" }}>
                {stock.name}
              </h3>
              {stock.sector && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{stock.sector}</span>
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
              <p
                className="text-2xl font-bold tabular-nums leading-none"
                style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}
              >
                ${fmt(stock.price)}
              </p>
              <p
                className="mt-1.5 flex items-center gap-1 text-sm font-semibold tabular-nums"
                style={{ color: positive ? "var(--accent-up)" : "var(--accent-down)" }}
              >
                {positive ? (
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 shrink-0" />
                )}
                {positive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </p>
            </div>
            <PEGYBadge pegy={stock.pegy} className="items-end" />
          </div>
        </div>

        {/* Fundamentals footer */}
        <div
          className="grid grid-cols-3 gap-px text-center"
          style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--border-subtle)" }}
        >
          {[
            { label: "P/E", value: stock.pe !== null ? stock.pe.toFixed(1) : "—" },
            {
              label: "Div Yield",
              value: stock.dividendYield !== null ? `${stock.dividendYield.toFixed(2)}%` : "—",
            },
            { label: "Mkt Cap", value: fmtMarketCap(stock.marketCap) },
          ].map((m) => (
            <div key={m.label} className="py-2.5 px-1" style={{ background: "var(--surface-card)" }}>
              <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                {m.label}
              </p>
              <p className="text-xs font-semibold tabular-nums" style={{ color: "var(--text-secondary)" }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
