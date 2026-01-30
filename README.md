# Flashcastr Health Dashboard

Real-time system status monitoring dashboard for Flashcastr services. Displays health metrics, uptime, memory usage, dependency checks, and response times.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your service URLs and API keys.

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BASIC_AUTH_USERNAME` | Username for basic auth (leave empty to disable) |
| `BASIC_AUTH_PASSWORD` | Password for basic auth (leave empty to disable) |
| `NEXT_PUBLIC_PRODUCER_URL` | Producer service URL |
| `PRODUCER_API_KEY` | API key for producer service |

## Adding Services

Update the `SERVICES` array in `app/page.tsx`:

```typescript
const SERVICES = [
  { name: 'Producer Bot', url: process.env.NEXT_PUBLIC_PRODUCER_URL || 'https://producer.flashcastr.app' },
  { name: 'New Service', url: 'https://new-service.flashcastr.app' },
];
```

## Pre-commit Hooks

This project uses Husky to run `npm run build` before each commit, ensuring code compiles successfully.

## Deployment

Deploy on Vercel or any platform supporting Next.js. Ensure environment variables are configured in your deployment settings.
