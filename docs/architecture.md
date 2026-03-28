# Architecture

## Overview

BlueTracker is a stateless Next.js application (App Router) that aggregates real-time stock data from three external APIs and displays it in a responsive dashboard. There is no persistent database — all data is fetched on demand and cached at the HTTP layer.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + PostCSS |
| UI Components | Lucide React (icons), Recharts (charts) |
| Data Fetching | SWR 2 (client), Next.js `fetch` with `revalidate` (server) |
| Font | Geist |
| Deployment | Vercel |

## Directory Structure

```
stock-tracker/
├── app/
│   ├── page.tsx                    # Home — major movers list
│   ├── login/page.tsx              # Login page
│   ├── dashboard/page.tsx          # Authenticated user dashboard
│   ├── stock/[ticker]/page.tsx     # Stock detail page
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # POST — issue session cookie
│       │   ├── logout/route.ts     # GET — clear session cookie
│       │   └── me/route.ts         # GET — return current user
│       └── stocks/
│           ├── route.ts            # GET — major movers
│           └── [ticker]/
│               ├── route.ts        # GET — single stock data
│               ├── history/route.ts   # GET — 30-day price history
│               └── yearago/route.ts   # GET — price 1 year ago
├── components/                     # Shared UI components
├── constants/
│   └── tickers.ts                  # Master list of ~200 tracked tickers
├── lib/
│   ├── apis/
│   │   ├── aggregator.ts           # Multi-source data aggregation logic
│   │   ├── finnhub.ts              # Finnhub API client
│   │   ├── alphavantage.ts         # Alpha Vantage API client
│   │   └── polygon.ts              # Polygon.io API client
│   ├── session.ts                  # Session cookie helpers
│   └── userContext.tsx             # Client-side user context (React Context)
└── public/                         # Static assets
```

## Data Flow

```
Browser → Next.js Route Handler → Aggregator → 3 External APIs (parallel)
                                              ↳ Finnhub
                                              ↳ Alpha Vantage
                                              ↳ Polygon.io
```

1. A client page (or SWR hook) calls an internal `/api/stocks/*` route.
2. The route handler calls the **Aggregator** (`lib/apis/aggregator.ts`).
3. The Aggregator fires requests to all three external APIs concurrently using `Promise.allSettled`, tolerating individual source failures.
4. Prices are averaged across all sources that returned data.
5. A data-quality flag is set when sources disagree by more than 1%.
6. The aggregated result is returned as JSON with Next.js cache revalidation applied.

## Caching Strategy

| Data | Revalidation |
|------|-------------|
| Real-time quote | 60 seconds |
| Basic fundamentals | 1 hour |
| 30-day price history | 1 hour |
| 1-year-ago price | 24 hours |
| Company overview | 24 hours |

## Authentication

Cookie-based session authentication. No third-party identity provider is active.

1. `POST /api/auth/login` validates credentials against `AUTH_USERNAME` / `AUTH_PASSWORD` environment variables.
2. On success, a `bp_session` cookie is set containing a base64-encoded JSON payload `{ user: { name, email } }`.
3. Server components read the cookie via `lib/session.ts` helpers; the `/dashboard` route redirects unauthenticated visitors to `/login`.
4. `GET /api/auth/logout` deletes the cookie and redirects to `/`.

> **Note:** The `@auth0/nextjs-auth0` package is installed as a dependency but is not used for active authentication. The `[...auth0]` catch-all route returns a 404. The `Auth0Provider` component wraps the app's `UserProvider` for compatibility only.

## Stock Aggregation

The PEGY ratio (Price/Earnings-to-Growth-and-Yield) is calculated as:

```
PEGY = P/E ÷ (Annual EPS Growth % + Dividend Yield %)
```

Stocks with PEGY < 1 are considered potentially undervalued.

## Tracked Tickers

Approximately 200 deduplicated blue-chip stocks sourced from:

- Dow Jones 30
- S&P 500 top 100 (by market cap)
- NASDAQ top 100
