// Top stocks from S&P 100, Dow Jones 30, and Nasdaq 100
// Indexed by symbol for deduplication and cross-referencing

export interface StockInfo {
  symbol: string;
  name: string;
  indices: ("SP100" | "DOW30" | "NASDAQ100")[];
}

export const STOCK_UNIVERSE: StockInfo[] = [
  // Dow Jones 30
  { symbol: "AAPL", name: "Apple Inc.", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "MSFT", name: "Microsoft Corporation", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "AMZN", name: "Amazon.com Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", indices: ["SP100", "NASDAQ100"] },
  { symbol: "META", name: "Meta Platforms Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "NVDA", name: "NVIDIA Corporation", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "TSLA", name: "Tesla Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", indices: ["SP100", "DOW30"] },
  { symbol: "JNJ", name: "Johnson & Johnson", indices: ["SP100", "DOW30"] },
  { symbol: "V", name: "Visa Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "PG", name: "Procter & Gamble Co.", indices: ["SP100", "DOW30"] },
  { symbol: "HD", name: "Home Depot Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "MA", name: "Mastercard Inc.", indices: ["SP100"] },
  { symbol: "BAC", name: "Bank of America Corp.", indices: ["SP100"] },
  { symbol: "ABBV", name: "AbbVie Inc.", indices: ["SP100"] },
  { symbol: "MRK", name: "Merck & Co. Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "WMT", name: "Walmart Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "COST", name: "Costco Wholesale Corp.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "CVX", name: "Chevron Corporation", indices: ["SP100", "DOW30"] },
  { symbol: "XOM", name: "Exxon Mobil Corporation", indices: ["SP100"] },
  { symbol: "ORCL", name: "Oracle Corporation", indices: ["SP100", "NASDAQ100"] },
  { symbol: "KO", name: "Coca-Cola Company", indices: ["SP100", "DOW30"] },
  { symbol: "MCD", name: "McDonald's Corporation", indices: ["SP100", "DOW30"] },
  { symbol: "IBM", name: "IBM Corporation", indices: ["SP100", "DOW30"] },
  { symbol: "GS", name: "Goldman Sachs Group Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "CAT", name: "Caterpillar Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "DIS", name: "Walt Disney Company", indices: ["SP100", "DOW30"] },
  { symbol: "INTC", name: "Intel Corporation", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "CRM", name: "Salesforce Inc.", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "HON", name: "Honeywell International Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "AXP", name: "American Express Company", indices: ["SP100", "DOW30"] },
  { symbol: "MMM", name: "3M Company", indices: ["SP100", "DOW30"] },
  { symbol: "NKE", name: "Nike Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "TRV", name: "Travelers Companies Inc.", indices: ["DOW30"] },
  { symbol: "BA", name: "Boeing Company", indices: ["SP100", "DOW30"] },
  { symbol: "VZ", name: "Verizon Communications Inc.", indices: ["SP100", "DOW30"] },
  { symbol: "CSCO", name: "Cisco Systems Inc.", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "WBA", name: "Walgreens Boots Alliance Inc.", indices: ["DOW30"] },
  { symbol: "DOW", name: "Dow Inc.", indices: ["DOW30"] },
  // Additional Nasdaq 100
  { symbol: "ADBE", name: "Adobe Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "NFLX", name: "Netflix Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", indices: ["NASDAQ100"] },
  { symbol: "QCOM", name: "Qualcomm Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "TXN", name: "Texas Instruments Inc.", indices: ["NASDAQ100"] },
  { symbol: "AVGO", name: "Broadcom Inc.", indices: ["SP100", "NASDAQ100"] },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", indices: ["NASDAQ100"] },
  { symbol: "INTU", name: "Intuit Inc.", indices: ["NASDAQ100"] },
  { symbol: "AMAT", name: "Applied Materials Inc.", indices: ["NASDAQ100"] },
  { symbol: "MU", name: "Micron Technology Inc.", indices: ["NASDAQ100"] },
  // Additional S&P 100
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", indices: ["SP100"] },
  { symbol: "LLY", name: "Eli Lilly and Company", indices: ["SP100"] },
  { symbol: "PFE", name: "Pfizer Inc.", indices: ["SP100"] },
  { symbol: "T", name: "AT&T Inc.", indices: ["SP100"] },
  { symbol: "GE", name: "GE Aerospace", indices: ["SP100"] },
  { symbol: "MS", name: "Morgan Stanley", indices: ["SP100"] },
  { symbol: "WFC", name: "Wells Fargo & Co.", indices: ["SP100"] },
  { symbol: "RTX", name: "RTX Corporation", indices: ["SP100"] },
  { symbol: "AMGN", name: "Amgen Inc.", indices: ["SP100", "DOW30", "NASDAQ100"] },
  { symbol: "SBUX", name: "Starbucks Corporation", indices: ["SP100", "NASDAQ100"] },
];

export const SP100_SYMBOLS = STOCK_UNIVERSE
  .filter((s) => s.indices.includes("SP100"))
  .map((s) => s.symbol);

export const DOW30_SYMBOLS = STOCK_UNIVERSE
  .filter((s) => s.indices.includes("DOW30"))
  .map((s) => s.symbol);

export const NASDAQ100_SYMBOLS = STOCK_UNIVERSE
  .filter((s) => s.indices.includes("NASDAQ100"))
  .map((s) => s.symbol);

export const ALL_SYMBOLS = STOCK_UNIVERSE.map((s) => s.symbol);
