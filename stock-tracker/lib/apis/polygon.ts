export interface PolygonPrevClose {
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  changePercent: number;
}

export interface PolygonHistoricalDay {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  changePercent: number;
}

const BASE = "https://api.polygon.io";

function apiKey(): string {
  const key = process.env.POLYGON_API_KEY;
  if (!key) throw new Error("POLYGON_API_KEY is not set");
  return key;
}

export async function polygonPrevClose(ticker: string): Promise<PolygonPrevClose> {
  const url = `${BASE}/v2/aggs/ticker/${encodeURIComponent(ticker)}/prev?adjusted=true&apiKey=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Polygon prev-close failed for ${ticker}: ${res.status}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error(`Polygon: no data for ${ticker}`);
  const r = data.results[0];
  const change = r.c - r.o;
  const changePercent = r.o !== 0 ? (change / r.o) * 100 : 0;
  return {
    price: r.c,
    open: r.o,
    high: r.h,
    low: r.l,
    volume: r.v,
    changePercent,
  };
}

export async function polygonHistoricalDay(
  ticker: string,
  targetDate: string // YYYY-MM-DD
): Promise<PolygonHistoricalDay> {
  // Fetch a ±7-day window around the target date to handle weekends/holidays
  const target = new Date(targetDate + "T12:00:00Z");
  const from = new Date(target);
  from.setDate(from.getDate() - 7);
  const to = new Date(target);
  to.setDate(to.getDate() + 7);

  const fromStr = from.toISOString().split("T")[0];
  const toStr = to.toISOString().split("T")[0];

  const url = `${BASE}/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=20&apiKey=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // historical data: cache 24h
  if (!res.ok)
    throw new Error(`Polygon historical failed for ${ticker}: ${res.status}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error(`Polygon: no historical data for ${ticker}`);

  // Find the result whose timestamp is closest to the target date (noon UTC avoids DST/timezone edge cases)
  const targetTime = target.getTime();
  let closest = data.results[0];
  let minDiff = Math.abs(closest.t - targetTime);
  for (const r of data.results) {
    const diff = Math.abs(r.t - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = r;
    }
  }

  const changePercent =
    closest.o !== 0 ? ((closest.c - closest.o) / closest.o) * 100 : 0;
  const date = new Date(closest.t).toISOString().split("T")[0];

  return {
    date,
    price: closest.c,
    open: closest.o,
    high: closest.h,
    low: closest.l,
    volume: closest.v,
    changePercent,
  };
}
