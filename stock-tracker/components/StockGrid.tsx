import { AggregatedStock } from "@/lib/apis/aggregator";
import StockCard from "./StockCard";
import { BarChart2 } from "lucide-react";

interface StockGridProps {
  stocks: AggregatedStock[];
}

export default function StockGrid({ stocks }: StockGridProps) {
  if (stocks.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl py-24 text-center"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <BarChart2 className="h-6 w-6" style={{ color: "var(--text-muted)" }} />
        </div>
        <p className="text-base font-semibold" style={{ color: "var(--text-secondary)" }}>No movers found</p>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
          Try lowering the change threshold.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stocks.map((stock) => (
        <StockCard key={stock.ticker} stock={stock} />
      ))}
    </div>
  );
}
