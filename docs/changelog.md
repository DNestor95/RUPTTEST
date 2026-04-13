# Changelog

All notable changes to BlueTracker are documented here.

## [Unreleased]

_No unreleased changes at this time._

## [Initial Release]

### Added

- **Home page** (`/`) — displays today's major stock movers with an adjustable percentage-change threshold slider. Threshold preference is persisted in `localStorage`.
- **Login page** (`/login`) — simple username/password authentication backed by environment variables.
- **Dashboard page** (`/dashboard`) — authenticated user view; server-side session check redirects unauthenticated visitors to `/login`.
- **Stock detail page** (`/stock/[ticker]`) — per-ticker view with:
  - Real-time OHLC bar chart
  - 30-day price history area chart
  - Fundamentals table (P/E, EPS, dividend yield, beta, market cap, 52-week range, PEGY ratio)
  - Year-over-year price comparison
  - Data confidence badges showing which external sources contributed data
- **Multi-source aggregation** — prices fetched in parallel from Finnhub, Alpha Vantage, and Polygon.io; averaged across available sources; discrepancies > 1% flagged.
- **PEGY ratio** calculation (`P/E ÷ (EPS growth % + dividend yield %)`).
- **~200 tracked tickers** from Dow Jones 30, S&P 500 top 100, and NASDAQ top 100.
- **Cookie-based session** (`bp_session`, httpOnly) — no external identity provider required.
- **Vercel deployment** configuration.
