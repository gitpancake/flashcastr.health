import { DetailedHealth, ProcessMetrics, QuickHealth } from './types';

export interface ServiceConfig {
  name: string;
  url: string;
  apiKey?: string;
}

export const services: ServiceConfig[] = [
  {
    name: 'Producer Bot',
    url: process.env.NEXT_PUBLIC_PRODUCER_URL || 'https://producer.flashcastr.app',
    apiKey: process.env.PRODUCER_API_KEY,
  },
];

export async function fetchQuickHealth(service: ServiceConfig): Promise<QuickHealth> {
  const response = await fetch(`${service.url}/health`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function fetchDetailedHealth(service: ServiceConfig): Promise<DetailedHealth> {
  const headers: HeadersInit = {};
  if (service.apiKey) {
    headers['x-api-key'] = service.apiKey;
  }
  
  const response = await fetch(`${service.url}/health/detailed`, {
    cache: 'no-store',
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function fetchMetrics(service: ServiceConfig): Promise<ProcessMetrics> {
  const headers: HeadersInit = {};
  if (service.apiKey) {
    headers['x-api-key'] = service.apiKey;
  }
  
  const response = await fetch(`${service.url}/health/metrics`, {
    cache: 'no-store',
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}
