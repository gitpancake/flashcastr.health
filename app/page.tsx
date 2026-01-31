'use client';

import { useEffect, useState, useCallback } from 'react';
import { ServiceCard } from '@/components/service-card';
import { ConsumerCard } from '@/components/consumer-card';
import { Heartbeat, OverallStatus } from '@/components/status-display';
import { DetailedHealth, ProducerHealth, ConsumerHealth, isConsumerHealth, isProducerHealth } from '@/lib/types';

interface ServiceState {
  name: string;
  type: 'producer' | 'consumer';
  health?: DetailedHealth;
  loading: boolean;
  error?: string;
}

const SERVICES = [
  {
    name: 'Producer Bot',
    type: 'producer' as const,
    url: process.env.NEXT_PUBLIC_PRODUCER_URL || 'https://producer.flashcastr.app',
  },
  {
    name: 'Consumer',
    type: 'consumer' as const,
    url: process.env.NEXT_PUBLIC_CONSUMER_URL || '',
  },
].filter(s => s.url);

const REFRESH_INTERVAL = 30;

export default function Dashboard() {
  const [services, setServices] = useState<ServiceState[]>(
    SERVICES.map((s) => ({ name: s.name, type: s.type, loading: true }))
  );
  const [lastCheck, setLastCheck] = useState<string>();

  const fetchHealth = useCallback(async () => {
    const results = await Promise.all(
      SERVICES.map(async (service) => {
        try {
          const response = await fetch(`/api/health?service=${encodeURIComponent(service.url)}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const health = await response.json();
          return { name: service.name, type: service.type, health, loading: false };
        } catch (err) {
          return {
            name: service.name,
            type: service.type,
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to fetch',
          };
        }
      })
    );

    setServices(results);
    setLastCheck(new Date().toISOString());
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const renderServiceCard = (service: ServiceState) => {
    if (service.type === 'consumer') {
      return (
        <ConsumerCard
          key={service.name}
          name={service.name}
          health={service.health as ConsumerHealth | undefined}
          loading={service.loading}
          error={service.error}
        />
      );
    }
    return (
      <ServiceCard
        key={service.name}
        name={service.name}
        health={service.health as ProducerHealth | undefined}
        loading={service.loading}
        error={service.error}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
      <div
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative">
        <header className="border-b border-white/10 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Flashcastr Health</h1>
                  <p className="text-sm text-white/50">System Status Dashboard</p>
                </div>
              </div>
              <Heartbeat interval={REFRESH_INTERVAL} lastCheck={lastCheck} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <section className="mb-8">
            <OverallStatus
              services={services.map((s) => ({
                status: s.health?.status,
                error: s.error,
              }))}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map(renderServiceCard)}
            </div>
          </section>

          <footer className="mt-12 text-center text-sm text-white/30">
            <p>Flashcastr Health Monitor &middot; Auto-refreshes every {REFRESH_INTERVAL}s</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
