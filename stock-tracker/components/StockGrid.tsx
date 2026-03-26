import { AggregatedStock } from "@/lib/apis/aggregator";
import StockCard from "./StockCard";

interface StockGridProps {
  stocks: AggregatedStock[];
}

export default function StockGrid({ stocks }: StockGridProps) {
  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-gray-400">No movers found</p>
        <p className="mt-1 text-sm text-gray-400">
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
