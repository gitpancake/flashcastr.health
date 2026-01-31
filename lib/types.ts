export interface QuickHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
}
export interface DetailedHealth {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  lastSync: string;
  metrics: {
  memoryUsage: number;
  failedFlashes: number;
  processUptime: number;
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
