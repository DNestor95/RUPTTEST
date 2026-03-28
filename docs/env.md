# Environment Variables

All environment variables are read by the Next.js server at runtime. They must be defined in `.env.local` for local development or in the Vercel project settings for deployed environments.

## Variables

### `FINNHUB_API_KEY`

- **Required:** Yes
- **Used in:** `stock-tracker/lib/apis/finnhub.ts`
- **Description:** API key for the [Finnhub](https://finnhub.io/) stock data service.
- **Provides:** Real-time quotes and basic financial metrics (P/E ratio, EPS, 52-week highs/lows).
- **How to obtain:** Register for a free account at <https://finnhub.io/> and copy the API key from the dashboard.

### `ALPHA_VANTAGE_KEY`

- **Required:** Yes
- **Used in:** `stock-tracker/lib/apis/alphavantage.ts`
- **Description:** API key for [Alpha Vantage](https://www.alphavantage.co/).
- **Provides:** Global quotes and company overview data (dividend yield, beta, market cap, EPS growth).
- **How to obtain:** Request a free key at <https://www.alphavantage.co/support/#api-key>.

### `POLYGON_API_KEY`

- **Required:** Yes
- **Used in:** `stock-tracker/lib/apis/polygon.ts`
- **Description:** API key for [Polygon.io](https://polygon.io/).
- **Provides:** Previous-day close data, 30-day historical prices, and single-day historical prices.
- **How to obtain:** Create a free account at <https://polygon.io/> and copy the API key from the dashboard.

### `AUTH_USERNAME`

- **Required:** Yes (defaults to `admin` if unset — change before any public deployment)
- **Used in:** `stock-tracker/app/api/auth/login/route.ts`
- **Description:** Username accepted by the login endpoint.

### `AUTH_PASSWORD`

- **Required:** Yes (defaults to `password` if unset — **do not use the default in production**)
- **Used in:** `stock-tracker/app/api/auth/login/route.ts`
- **Description:** Password accepted by the login endpoint.

## Local `.env.local` Example

```env
# External API keys
FINNHUB_API_KEY=your_finnhub_api_key_here
ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
POLYGON_API_KEY=your_polygon_api_key_here

# Application credentials
AUTH_USERNAME=admin
AUTH_PASSWORD=changeme
```

Place this file at `stock-tracker/.env.local`. It is listed in `.gitignore` and must never be committed to version control.

## Notes

- Variables without the `NEXT_PUBLIC_` prefix are only accessible server-side. All variables in this app are server-side only; none are exposed to the browser bundle.
- If any required API key is missing, the data source that relies on it will fail silently. The aggregator uses `Promise.allSettled` so the app will still render using the remaining sources, but data quality may be reduced.
