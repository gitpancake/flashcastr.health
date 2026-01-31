import { NextResponse } from 'next/server';

interface ServiceConfig {
  name: string;
  type: 'producer' | 'consumer';
  url: string;
  apiKey: string | undefined;
}

async function fetchServiceHealth(service: ServiceConfig) {
  try {
    const headers: HeadersInit = {};
    if (service.apiKey) {
      headers['x-api-key'] = service.apiKey;
    }

    const response = await fetch(`${service.url}/health/detailed`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      // Try quick health as fallback
      const quickResponse = await fetch(`${service.url}/health`, {
        cache: 'no-store',
      });

      if (quickResponse.ok) {
        const quickData = await quickResponse.json();
        return {
          name: service.name,
          type: service.type,
          health: quickData,
          loading: false,
        };
      }

      throw new Error(`Service returned ${response.status}`);
    }

    const health = await response.json();
    return {
      name: service.name,
      type: service.type,
      health,
      loading: false,
    };
  } catch (err) {
    return {
      name: service.name,
      type: service.type,
      loading: false,
      error: err instanceof Error ? err.message : 'Failed to fetch',
    };
  }
}

export async function GET() {
  const services: ServiceConfig[] = [];

  // Add producer if configured
  const producerUrl = process.env.PRODUCER_URL;
  if (producerUrl) {
    services.push({
      name: 'Producer Bot',
      type: 'producer',
      url: producerUrl,
      apiKey: process.env.PRODUCER_API_KEY,
    });
  }

  // Add consumer if configured
  const consumerUrl = process.env.CONSUMER_URL;
  if (consumerUrl) {
    services.push({
      name: 'Consumer',
      type: 'consumer',
      url: consumerUrl,
      apiKey: process.env.CONSUMER_API_KEY,
    });
  }

  const results = await Promise.all(services.map(fetchServiceHealth));

  return NextResponse.json(results);
}
