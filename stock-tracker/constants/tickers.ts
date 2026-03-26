// Dow Jones Industrial Average 30
export const DOW30: string[] = [
  "AAPL", "AMGN", "AXP", "BA", "CAT", "CRM", "CSCO", "CVX", "DIS", "DOW",
  "GS", "HD", "HON", "IBM", "INTC", "JNJ", "JPM", "KO", "MCD", "MMM",
  "MRK", "MSFT", "NKE", "PG", "TRV", "UNH", "V", "VZ", "WBA", "WMT",
];

// S&P 500 Top 100 by market cap
export const SP100: string[] = [
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "BRK.B", "UNH",
  "XOM", "JPM", "LLY", "JNJ", "V", "PG", "MA", "MRK", "HD", "ABBV", "CVX",
  "AVGO", "ORCL", "COST", "PEP", "KO", "BAC", "WMT", "MCD", "NFLX", "ADBE",
  "CRM", "TMO", "ABT", "AMD", "LIN", "ACN", "MS", "CSCO", "DIS", "GE",
  "IBM", "WFC", "TXN", "NEE", "UNP", "PM", "LOW", "AMGN", "ISRG", "HON",
  "VZ", "INTU", "GS", "CAT", "SPGI", "BKNG", "RTX", "AMAT", "BLK", "AXP",
  "SYK", "GILD", "MDLZ", "PLD", "ADP", "ELV", "CI", "REGN", "BSX", "MMC",
  "DE", "VRTX", "ADI", "MO", "CB", "SCHW", "ETN", "ZTS", "AON", "HUM",
  "TJX", "CME", "PANW", "SO", "MMM", "SHW", "ICE", "ITW", "DUK", "NGG",
  "KMB", "BMY", "MCO", "CL", "USB", "PSA", "KLAC", "CDNS", "TGT", "GD",
];

// NASDAQ 100 Top 100
export const NASDAQ100: string[] = [
  "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "AVGO", "COST",
  "ADBE", "AMD", "CSCO", "NFLX", "PEP", "LIN", "QCOM", "INTU", "ISRG",
  "AMAT", "BKNG", "PANW", "MU", "REGN", "VRTX", "LRCX", "ADP", "KLAC",
  "CDNS", "SNPS", "MELI", "ABNB", "CEG", "CSGP", "FTNT", "MRVL", "TEAM",
  "DXCM", "TTD", "ODFL", "FANG", "ROST", "FAST", "CPRT", "ON", "BKR",
  "PCAR", "DDOG", "ZS", "VRSK", "GEHC", "CTSH", "MNST", "EA", "BIIB",
  "XEL", "KDP", "CTAS", "AEP", "DLTR", "EXC", "IDXX", "WBD", "ILMN",
  "ALGN", "SIRI", "SBUX", "CSX", "PAYX", "ORLY", "WDAY", "CRWD", "NXPI",
  "AZN", "PDD", "CHTR", "GOOG", "ENPH", "FSLR", "ROP", "MRNA", "KHC",
  "OKTA", "ZM", "DOCU", "SPLK", "RIVN", "LCID", "WBA", "MDLZ", "LULU",
  "HON", "TXN", "CMCSA", "GFS", "TSCO", "ASML", "TMUS", "ADI", "INTC",
  "MCHP",
];

// Deduplicated master list
export const ALL_TICKERS: string[] = Array.from(
  new Set([...DOW30, ...SP100, ...NASDAQ100])
);
