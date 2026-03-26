import { NextRequest, NextResponse } from "next/server";
import { STOCK_UNIVERSE } from "@/app/lib/stocks-data";
import type { StockQuote } from "@/app/lib/stocks";

/**
 * Generates deterministic mock stock data based on symbol and date.
 * In production, replace this with calls to a real market data provider
 * such as Alpha Vantage, Polygon.io, or Yahoo Finance.
 */
const SEED_MULTIPLIER = 17;
const MILLISECONDS_PER_DAY = 86_400_000;
const NOISE_SCALE = 100;
const NOISE_OFFSET = 0.5;
const MAX_CHANGE_PERCENT = 5; // ±5% daily swing
function generateMockQuote(
  symbol: string,
  name: string,
  indices: string[]
): StockQuote {
  // Use symbol characters to produce stable base prices
  const seed = symbol
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const basePrice = 50 + (seed % 950); // $50 – $1000
  const dailyNoise =
    ((seed * SEED_MULTIPLIER + Date.now() / MILLISECONDS_PER_DAY) % NOISE_SCALE) /
      NOISE_SCALE -
    NOISE_OFFSET;
  const changePercent = parseFloat((dailyNoise * MAX_CHANGE_PERCENT * 2).toFixed(2));
  const price = parseFloat((basePrice * (1 + changePercent / 100)).toFixed(2));
  const change = parseFloat((price - basePrice).toFixed(2));
  const volume = Math.floor(1_000_000 + (seed % 50_000_000));
  const marketCap = Math.floor(price * (1_000_000_000 + (seed % 2_000_000_000_000)));

  return {
    symbol,
    name,
    price,
    change,
    changePercent,
    volume,
    marketCap,
    indices,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols");

  const requestedSymbols = symbolsParam
    ? symbolsParam.split(",").map((s) => s.trim().toUpperCase())
    : STOCK_UNIVERSE.map((s) => s.symbol);

  const quotes: StockQuote[] = requestedSymbols
    .map((sym) => {
      const info = STOCK_UNIVERSE.find((s) => s.symbol === sym);
      if (!info) return null;
      return generateMockQuote(
        info.symbol,
        info.name,
        info.indices as string[]
      );
    })
    .filter((q): q is StockQuote => q !== null);

  return NextResponse.json(quotes);
}
