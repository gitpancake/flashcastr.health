import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const serviceUrl = request.nextUrl.searchParams.get('service');
  
  if (!serviceUrl) {
    return NextResponse.json({ error: 'Missing service URL' }, { status: 400 });
  }

  try {
    const apiKey = process.env.PRODUCER_API_KEY;
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
          metrics: { memoryUsage: 0, failedFlashes: 0, processUptime: 0 },
          checks: {
            database: 'unknown',
            rabbitmq: 'unknown',
            spaceInvadersAPI: 'unknown',
            diskPersistence: 'unknown',
          },
          responseTimes: { database: 0, rabbitmq: 0, api: 0 },
          uptime: 0,
          lastSync: 'unknown',
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
