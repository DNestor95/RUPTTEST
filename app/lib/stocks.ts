export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  indices: string[];
}

export interface CrossReferencedStock extends StockQuote {
  indexCount: number;
}

/**
 * Fetches stock quotes from the internal API route.
 * Throws an error if the request fails.
 */
export async function fetchStockQuotes(
  symbols: string[]
): Promise<StockQuote[]> {
  const params = new URLSearchParams({ symbols: symbols.join(",") });
  const res = await fetch(`/api/stocks?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stock data");
  return res.json() as Promise<StockQuote[]>;
}

/**
 * Returns stocks that appear in more than one index (cross-referenced),
 * sorted by the absolute percentage change descending.
 */
export function getCrossReferencedMovers(
  quotes: StockQuote[],
  minIndices = 2,
  limit = 20
): CrossReferencedStock[] {
  return quotes
    .filter((q) => q.indices.length >= minIndices)
    .map((q) => ({ ...q, indexCount: q.indices.length }))
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, limit);
}

/**
 * Returns the biggest movers (gainers + losers) from all quotes.
 */
export function getBiggestMovers(
  quotes: StockQuote[],
  limit = 10
): StockQuote[] {
  return [...quotes]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, limit);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toLocaleString();
}
