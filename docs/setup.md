# Developer Setup

## Prerequisites

- Node.js 18 or later
- npm (bundled with Node.js)
- API keys for Finnhub, Alpha Vantage, and Polygon.io (free tiers are sufficient)

## 1. Clone and install

```bash
git clone https://github.com/DNestor95/RUPTTEST.git
cd RUPTTEST/stock-tracker
npm install
```

## 2. Configure environment variables

Create a `.env.local` file inside `stock-tracker/`:

```bash
cp .env.local.example .env.local   # if the example file exists, otherwise create it manually
```

Populate it with your keys (see [`docs/env.md`](env.md) for details on each variable):

```env
FINNHUB_API_KEY=your_finnhub_key
ALPHA_VANTAGE_KEY=your_alpha_vantage_key
POLYGON_API_KEY=your_polygon_key
AUTH_USERNAME=admin
AUTH_PASSWORD=changeme
```

## 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 4. Log in

Open `http://localhost:3000/login` and enter the credentials you set via `AUTH_USERNAME` and `AUTH_PASSWORD`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload (Turbopack) |
| `npm run build` | Compile a production build |
| `npm start` | Serve a production build (requires `npm run build` first) |
| `npm run lint` | Run ESLint across the project |

## Project Structure

See [`docs/architecture.md`](architecture.md) for a full directory breakdown.

## Notes

- The `stock-tracker/` subdirectory is the Next.js root. All `npm` commands must be run from inside it.
- `.env.local` is git-ignored; never commit API keys or credentials.
- The free tiers of Finnhub, Alpha Vantage, and Polygon have rate limits. The aggregator batches requests and uses staggered caching intervals to stay within those limits.
