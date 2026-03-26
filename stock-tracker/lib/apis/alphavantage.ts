export interface AVGlobalQuote {
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface AVOverview {
  pe: number | null;
  eps: number | null;
  epsGrowthAnnual: number | null;
  dividendYield: number | null;
  beta: number | null;
  forwardPE: number | null;
  priceToBook: number | null;
  name: string;
  sector: string;
  industry: string;
  marketCap: number | null;
}

const BASE = "https://www.alphavantage.co/query";

function apiKey(): string {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) throw new Error("ALPHA_VANTAGE_KEY is not set");
  return key;
}

function parseNumber(val: string | undefined): number | null {
  if (!val || val === "None" || val === "-") return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

export async function alphavantageQuote(ticker: string): Promise<AVGlobalQuote> {
  const url = `${BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Alpha Vantage quote failed for ${ticker}: ${res.status}`);
  const data = await res.json();
  const q = data["Global Quote"];
  if (!q || !q["05. price"]) throw new Error(`Alpha Vantage: no quote data for ${ticker}`);
  return {
    price: parseFloat(q["05. price"]),
    change: parseFloat(q["09. change"]),
    changePercent: parseFloat(q["10. change percent"]?.replace("%", "")),
    previousClose: parseFloat(q["08. previous close"]),
    open: parseFloat(q["02. open"]),
    high: parseFloat(q["03. high"]),
    low: parseFloat(q["04. low"]),
    volume: parseInt(q["06. volume"], 10),
  };
}

export async function alphavantageOverview(ticker: string): Promise<AVOverview> {
  const url = `${BASE}?function=OVERVIEW&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey()}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h — free tier limited
  if (!res.ok) throw new Error(`Alpha Vantage overview failed for ${ticker}: ${res.status}`);
  const d = await res.json();
  if (!d || !d.Symbol) throw new Error(`Alpha Vantage: no overview data for ${ticker}`);
  return {
    pe: parseNumber(d.PERatio),
    forwardPE: parseNumber(d.ForwardPE),
    eps: parseNumber(d.EPS),
    epsGrowthAnnual: parseNumber(d.QuarterlyEarningsGrowthYOY)
      ? parseNumber(d.QuarterlyEarningsGrowthYOY)! * 100
      : null,
    dividendYield: parseNumber(d.DividendYield)
      ? parseNumber(d.DividendYield)! * 100
      : null,
    beta: parseNumber(d.Beta),
    priceToBook: parseNumber(d.PriceToBookRatio),
    name: d.Name ?? ticker,
    sector: d.Sector ?? "",
    industry: d.Industry ?? "",
    marketCap: parseNumber(d.MarketCapitalization),
  };
}
