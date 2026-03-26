# RUPTTEST
TEST RUPT
contribution

## BlueTracker — Stock Tracker

The main application lives in the `stock-tracker/` directory. It is a Next.js app deployed on Vercel.

### Deploy on Vercel

The `vercel.json` at the repo root sets `rootDirectory` to `stock-tracker` so Vercel builds and deploys the Next.js app automatically.

Set the following environment variables in your Vercel project settings before deploying:

| Variable | Description |
|---|---|
| `FINNHUB_API_KEY` | API key from [Finnhub](https://finnhub.io/) |
| `ALPHA_VANTAGE_KEY` | API key from [Alpha Vantage](https://www.alphavantage.co/) |
| `POLYGON_API_KEY` | API key from [Polygon.io](https://polygon.io/) |
| `AUTH_USERNAME` | Login username (**required** — do not rely on the insecure default) |
| `AUTH_PASSWORD` | Login password (**required** — do not rely on the insecure default) |

