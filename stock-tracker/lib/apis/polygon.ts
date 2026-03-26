export interface PolygonPrevClose {
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

export interface PolygonDailyBar {
  date: string;
  close: number;
}

export async function polygonHistoricalPrices(
  ticker: string,
  days: number = 30
): Promise<PolygonDailyBar[]> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  const toStr = to.toISOString().split("T")[0];
  const fromStr = from.toISOString().split("T")[0];
  const url = `${BASE}/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=50&apiKey=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Polygon history failed for ${ticker}: ${res.status}`);
  const data = await res.json();
  if (!data.results || data.results.length === 0)
    throw new Error(`No history data for ${ticker}`);
  return data.results.map((r: { t: number; c: number }) => ({
    date: new Date(r.t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    close: r.c,
  }));
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
