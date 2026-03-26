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
