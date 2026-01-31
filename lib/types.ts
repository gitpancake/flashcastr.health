export interface QuickHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
}

export interface MessageStats {
  published: number;
  failed: number;
  lastPublishedAt: string | null;
  startedAt: string;
}

// Producer Bot health response
export interface ProducerHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  lastSync: string;
  metrics: {
    memoryUsage: number;
    failedFlashes: number;
    processUptime: number;
    messages?: MessageStats;
  };
  checks: {
    database: 'healthy' | 'unhealthy' | 'degraded';
    rabbitmq: 'healthy' | 'unhealthy' | 'degraded';
    diskPersistence: 'healthy' | 'unhealthy' | 'degraded';
  };
  responseTimes: {
    database: number;
    rabbitmq: number;
  };
  error?: string;
}

// Consumer health response
export interface ConsumerHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  lastProcessed: string;
  metrics: {
    memoryUsage: number;
    processingRate: number;
    errorRate: number;
  };
  checks: {
    database: 'healthy' | 'unhealthy' | 'degraded' | 'pass' | 'warn' | 'fail';
    pinata: 'healthy' | 'unhealthy' | 'degraded' | 'pass' | 'warn' | 'fail';
    memory: 'healthy' | 'unhealthy' | 'degraded' | 'pass' | 'warn' | 'fail';
    processing: 'healthy' | 'unhealthy' | 'degraded' | 'pass' | 'warn' | 'fail';
  };
  responseTimes: {
    database: number;
    pinata: number;
  };
  error?: string;
}

// Union type for any service health
export type DetailedHealth = ProducerHealth | ConsumerHealth;

export interface ProcessMetrics {
  process: {
    uptime: number;
    pid: number;
    version: string;
  };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  timestamp: number;
}

export interface ServiceHealth {
  name: string;
  url: string;
  quick?: QuickHealth;
  detailed?: DetailedHealth;
  metrics?: ProcessMetrics;
  error?: string;
  loading: boolean;
}

// Type guard to check if health is ProducerHealth
export function isProducerHealth(health: DetailedHealth): health is ProducerHealth {
  return health.service === 'invaders-bot';
}

// Type guard to check if health is ConsumerHealth
export function isConsumerHealth(health: DetailedHealth): health is ConsumerHealth {
  return health.service === 'invaders-consumer';
}
