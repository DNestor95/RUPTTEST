export interface FinnhubQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;   // low
  o: number;   // open
  pc: number;  // previous close
  t: number;   // timestamp
}

export interface FinnhubBasicFinancials {
  metric: {
    peNormalizedAnnual?: number;
    epsNormalizedAnnual?: number;
    revenueGrowth3Y?: number;
    dividendYieldIndicatedAnnual?: number;
    "52WeekHigh"?: number;
    "52WeekLow"?: number;
  };
}

const BASE = "https://finnhub.io/api/v1";

function apiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

export async function finnhubQuote(ticker: string): Promise<FinnhubQuote> {
  const res = await fetch(
    `${BASE}/quote?symbol=${encodeURIComponent(ticker)}&token=${apiKey()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`Finnhub quote failed for ${ticker}: ${res.status}`);
  return res.json();
}

export async function finnhubBasicFinancials(
  ticker: string
): Promise<FinnhubBasicFinancials> {
  const res = await fetch(
    `${BASE}/stock/metric?symbol=${encodeURIComponent(ticker)}&metric=all&token=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok)
    throw new Error(`Finnhub financials failed for ${ticker}: ${res.status}`);
  return res.json();
}
