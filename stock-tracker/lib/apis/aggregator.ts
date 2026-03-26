import { finnhubQuote, finnhubBasicFinancials } from "./finnhub";
import { alphavantageQuote, alphavantageOverview } from "./alphavantage";
import { polygonPrevClose } from "./polygon";

export interface AggregatedStock {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  // Prices — averaged across available sources
  price: number;
  priceOpen: number;
  priceHigh: number;
  priceLow: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  // Fundamentals (from Alpha Vantage + Finnhub)
  pe: number | null;
  eps: number | null;
  epsGrowthAnnual: number | null;
  dividendYield: number | null;
  beta: number | null;
  marketCap: number | null;
  week52High: number | null;
  week52Low: number | null;
  // PEGY (computed)
  pegy: number | null;
  // Data quality
  sourcesPrice: number;       // how many sources provided price
  priceDiscrepancy: boolean;  // true if any two sources differ >1%
  sources: string[];          // which sources returned successfully
}

/** Average a list of non-null numbers */
function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Check if max deviation across numeric array exceeds threshold % */
function exceedsDeviation(nums: number[], thresholdPercent: number): boolean {
  if (nums.length < 2) return false;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === 0) return false;
  return ((max - min) / min) * 100 > thresholdPercent;
}

export async function aggregateStock(ticker: string): Promise<AggregatedStock> {
  // Fetch all three sources in parallel; tolerate individual failures
  const [finnhubQuoteRes, avQuoteRes, polygonRes, finnhubFundRes, avOverviewRes] =
    await Promise.allSettled([
      finnhubQuote(ticker),
      alphavantageQuote(ticker),
      polygonPrevClose(ticker),
      finnhubBasicFinancials(ticker),
      alphavantageOverview(ticker),
    ]);

  const prices: number[] = [];
  const changePcts: number[] = [];
  const opens: number[] = [];
  const highs: number[] = [];
  const lows: number[] = [];
  const volumes: number[] = [];
  const prevCloses: number[] = [];
  const sources: string[] = [];

  if (finnhubQuoteRes.status === "fulfilled" && finnhubQuoteRes.value.c > 0) {
    const q = finnhubQuoteRes.value;
    prices.push(q.c);
    changePcts.push(q.dp);
    opens.push(q.o);
    highs.push(q.h);
    lows.push(q.l);
    prevCloses.push(q.pc);
    sources.push("Finnhub");
  }

  if (avQuoteRes.status === "fulfilled") {
    const q = avQuoteRes.value;
    prices.push(q.price);
    changePcts.push(q.changePercent);
    opens.push(q.open);
    highs.push(q.high);
    lows.push(q.low);
    volumes.push(q.volume);
    prevCloses.push(q.previousClose);
    sources.push("Alpha Vantage");
  }

  if (polygonRes.status === "fulfilled") {
    const p = polygonRes.value;
    prices.push(p.price);
    changePcts.push(p.changePercent);
    opens.push(p.open);
    highs.push(p.high);
    lows.push(p.low);
    volumes.push(p.volume);
    sources.push("Polygon");
  }

  if (prices.length === 0) {
    throw new Error(`No price data available for ${ticker}`);
  }

  // --- Fundamentals ---
  let pe: number | null = null;
  let eps: number | null = null;
  let epsGrowthAnnual: number | null = null;
  let dividendYield: number | null = null;
  let beta: number | null = null;
  let marketCap: number | null = null;
  let week52High: number | null = null;
  let week52Low: number | null = null;
  let name = ticker;
  let sector = "";
  let industry = "";

  if (avOverviewRes.status === "fulfilled") {
    const o = avOverviewRes.value;
    pe = o.pe;
    eps = o.eps;
    epsGrowthAnnual = o.epsGrowthAnnual;
    dividendYield = o.dividendYield;
    beta = o.beta;
    marketCap = o.marketCap;
    name = o.name;
    sector = o.sector;
    industry = o.industry;
  }

  if (finnhubFundRes.status === "fulfilled") {
    const m = finnhubFundRes.value.metric;
    // Prefer Alpha Vantage values; fall back to Finnhub
    if (pe === null && m.peNormalizedAnnual) pe = m.peNormalizedAnnual;
    if (eps === null && m.epsNormalizedAnnual) eps = m.epsNormalizedAnnual;
    if (dividendYield === null && m.dividendYieldIndicatedAnnual)
      dividendYield = m.dividendYieldIndicatedAnnual;
    week52High = m["52WeekHigh"] ?? null;
    week52Low = m["52WeekLow"] ?? null;
    if (epsGrowthAnnual === null && m.revenueGrowth3Y)
      epsGrowthAnnual = m.revenueGrowth3Y;
  }

  // --- PEGY = PE / (EPS growth % + Dividend yield %) ---
  let pegy: number | null = null;
  if (pe !== null && pe > 0) {
    const growth = epsGrowthAnnual ?? 0;
    const div = dividendYield ?? 0;
    const denominator = growth + div;
    if (denominator > 0) {
      pegy = pe / denominator;
    }
  }

  return {
    ticker,
    name,
    sector,
    industry,
    price: avg(prices),
    priceOpen: opens.length > 0 ? avg(opens) : 0,
    priceHigh: highs.length > 0 ? avg(highs) : 0,
    priceLow: lows.length > 0 ? avg(lows) : 0,
    changePercent: avg(changePcts),
    previousClose: prevCloses.length > 0 ? avg(prevCloses) : 0,
    volume: volumes.length > 0 ? avg(volumes) : 0,
    pe,
    eps,
    epsGrowthAnnual,
    dividendYield,
    beta,
    marketCap,
    week52High,
    week52Low,
    pegy,
    sourcesPrice: prices.length,
    priceDiscrepancy: exceedsDeviation(prices, 1),
    sources,
  };
}
