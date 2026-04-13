# Deployment

## Platform

BlueTracker is deployed on **Vercel**. The Next.js application lives in the `stock-tracker/` subdirectory of the repository.

## Vercel Configuration

The `vercel.json` file at the repository root is currently empty (`{}`). To ensure Vercel builds the correct subdirectory, set the **Root Directory** to `stock-tracker` in the Vercel project settings UI (Project → Settings → General → Root Directory).

Alternatively, add the following to `vercel.json`:

```json
{
  "rootDirectory": "stock-tracker"
}
```

## Automatic Deployments

Once the Vercel project is connected to this GitHub repository:

- Every push to `main` triggers a **production deployment**.
- Every pull request generates a **preview deployment** with a unique URL.

## Environment Variables

Set the following variables in the Vercel project settings (Project → Settings → Environment Variables) before the first deploy:

| Variable | Required | Description |
|----------|----------|-------------|
| `FINNHUB_API_KEY` | Yes | Finnhub stock quote API key |
| `ALPHA_VANTAGE_KEY` | Yes | Alpha Vantage quote & overview API key |
| `POLYGON_API_KEY` | Yes | Polygon.io historical prices API key |
| `AUTH_USERNAME` | Yes | Application login username |
| `AUTH_PASSWORD` | Yes | Application login password |

See [`docs/env.md`](env.md) for full descriptions and how to obtain each key.

## Manual Deployment Steps

1. Push code to the `main` branch (or merge a pull request).
2. Vercel detects the push and starts a build automatically.
3. The build runs `next build` inside `stock-tracker/`.
4. On success, the new version is promoted to production.

## Build Command

```
next build
```

## Output Directory

`.next` (managed by Vercel — no manual configuration needed).

## Node.js Version

Vercel defaults to the Node.js version specified in `package.json`. The app requires **Node.js 18+**.

## Rollbacks

To roll back to a previous deployment, use the Vercel dashboard: Project → Deployments → select a past deployment → Promote to Production.
