import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const serviceUrl = request.nextUrl.searchParams.get('service');

  if (!serviceUrl) {
    return NextResponse.json({ error: 'Missing service URL' }, { status: 400 });
  }

  try {
    // Determine which API key to use based on the service URL
    const producerUrl = process.env.NEXT_PUBLIC_PRODUCER_URL || '';
    const consumerUrl = process.env.NEXT_PUBLIC_CONSUMER_URL || '';
    
    let apiKey: string | undefined;
    if (serviceUrl.includes(producerUrl) || serviceUrl === producerUrl) {
      apiKey = process.env.PRODUCER_API_KEY;
    } else if (serviceUrl.includes(consumerUrl) || serviceUrl === consumerUrl) {
      apiKey = process.env.CONSUMER_API_KEY;
    } else {
      // Fallback: try producer key first
      apiKey = process.env.PRODUCER_API_KEY || process.env.CONSUMER_API_KEY;
    }

    const headers: HeadersInit = {};
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(`${serviceUrl}/health/detailed`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      // Try quick health as fallback
      const quickResponse = await fetch(`${serviceUrl}/health`, {
        cache: 'no-store',
      });

      if (quickResponse.ok) {
        const quickData = await quickResponse.json();
        return NextResponse.json({
          ...quickData,
          metrics: { memoryUsage: 0, processingRate: 0, errorRate: 0 },
          checks: {
            database: 'unknown',
            pinata: 'unknown',
            memory: 'unknown',
            processing: 'unknown',
          },
          responseTimes: { database: 0, pinata: 0 },
          uptime: 0,
          lastProcessed: 'unknown',
        });
      }

      throw new Error(`Service returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        service: 'unknown',
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Failed to fetch health',
      },
      { status: 502 }
    );
  }
}
