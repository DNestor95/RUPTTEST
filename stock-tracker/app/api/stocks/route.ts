import { NextRequest, NextResponse } from "next/server";
import { ALL_TICKERS } from "@/constants/tickers";
import { aggregateStock, AggregatedStock } from "@/lib/apis/aggregator";

// Revalidate every 60 seconds so free-tier rate limits are respected
export const revalidate = 60;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const threshold = parseFloat(searchParams.get("threshold") ?? "3");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  // Batch tickers in groups of 5 to avoid hammering rate limits simultaneously
  const BATCH = 5;
  const results: AggregatedStock[] = [];

  for (let i = 0; i < ALL_TICKERS.length; i += BATCH) {
    const batch = ALL_TICKERS.slice(i, i + BATCH);
    const settled = await Promise.allSettled(
      batch.map((ticker) => aggregateStock(ticker))
    );
    for (const r of settled) {
      if (r.status === "fulfilled") {
        results.push(r.value);
      }
    }
  }

  // Filter by absolute % change threshold and sort by magnitude
  const movers = results
    .filter((s) => Math.abs(s.changePercent) >= threshold)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, limit);

  return NextResponse.json({ movers, fetchedAt: new Date().toISOString() });
}
