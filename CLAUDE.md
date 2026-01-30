# CLAUDE.md

This file provides guidance for Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**Flashcastr Health Dashboard** - A real-time system status monitoring dashboard that displays health metrics from Flashcastr backend services. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

The dashboard polls backend service health endpoints every 30 seconds, displaying uptime, memory usage, dependency checks (database, RabbitMQ, APIs), and response times through an interactive UI.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript 5
- **Styling**: Dark theme with glassmorphism effects

## Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

```
app/
├── api/health/route.ts    # Proxies health checks to backend services
├── page.tsx               # Main dashboard with 30s polling
├── layout.tsx             # Root layout with metadata
└── globals.css            # Global styles and Tailwind

components/
├── service-card.tsx       # Individual service health display
└── status-display.tsx     # Heartbeat timer and overall status

lib/
├── types.ts               # TypeScript interfaces (QuickHealth, DetailedHealth, etc.)
└── health-api.ts          # Service configuration and fetch functions
```

## Key Patterns

### Health Data Flow
1. `page.tsx` calls `fetchHealth()` on mount and every 30 seconds
2. API route (`/api/health?service=URL`) proxies to `{serviceUrl}/health/detailed`
3. Falls back to `{serviceUrl}/health` if detailed endpoint unavailable
4. Response rendered in `ServiceCard` components

### Adding a New Service
Update the `SERVICES` array in `app/page.tsx`:
```typescript
const SERVICES = [
  { name: 'Service Name', url: 'https://service.url' },
];
```

### Environment Variables
```bash
BASIC_AUTH_USERNAME=admin                                 # Basic auth username (leave empty to disable)
BASIC_AUTH_PASSWORD=your-password-here                    # Basic auth password (leave empty to disable)
NEXT_PUBLIC_PRODUCER_URL=https://producer.flashcastr.app  # Default service URL
PRODUCER_API_KEY=your-api-key-here                        # Optional API auth
```

## Type Definitions

Core types are in `lib/types.ts`:
- `QuickHealth` - Basic health response (status, timestamp)
- `DetailedHealth` - Full health with checks, metrics, uptime
- `ProcessMetrics` - Memory and CPU usage
- `ServiceHealth` - UI state including loading/error

## UI Status Colors

- **Healthy**: Emerald (`bg-emerald-500`)
- **Degraded**: Amber (`bg-amber-500`)
- **Unhealthy**: Red (`bg-red-500`)
