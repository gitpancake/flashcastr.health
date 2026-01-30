'use client';

import { useEffect, useState } from 'react';

interface HeartbeatProps {
  interval?: number;
  lastCheck?: string;
}

export function Heartbeat({ interval = 30, lastCheck }: HeartbeatProps) {
  const [countdown, setCountdown] = useState(interval);
  const [beat, setBeat] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setBeat(true);
          setTimeout(() => setBeat(false), 300);
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div
          className={`w-4 h-4 rounded-full bg-emerald-500 transition-transform duration-300 ${
            beat ? 'scale-150' : 'scale-100'
          }`}
        />
        <div
          className={`absolute inset-0 w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-75`}
        />
      </div>
      <div className="text-sm">
        <p className="text-white/60">Next refresh in</p>
        <p className="text-white font-mono font-semibold">{countdown}s</p>
      </div>
      {lastCheck && (
        <div className="text-sm border-l border-white/10 pl-4 ml-2">
          <p className="text-white/60">Last checked</p>
          <p className="text-white font-mono">{new Date(lastCheck).toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
}

interface OverallStatusProps {
  services: Array<{ status?: string; error?: string }>;
}

export function OverallStatus({ services }: OverallStatusProps) {
  const allHealthy = services.every((s) => s.status === 'healthy' && !s.error);
  const anyUnhealthy = services.some((s) => s.status === 'unhealthy' || s.error);

  const status = anyUnhealthy ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded';

  const config = {
    healthy: {
      bg: 'from-emerald-500/20 to-emerald-600/5',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      label: 'All Systems Operational',
      icon: 'M5 13l4 4L19 7',
    },
    degraded: {
      bg: 'from-amber-500/20 to-amber-600/5',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      label: 'Partial System Outage',
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    unhealthy: {
      bg: 'from-red-500/20 to-red-600/5',
      border: 'border-red-500/30',
      text: 'text-red-400',
      label: 'Major System Outage',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  };

  const c = config[status];

  return (
    <div className={`rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-8 backdrop-blur-sm`}>
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-3 ${c.text} bg-white/5`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
          </svg>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${c.text}`}>{c.label}</h2>
          <p className="text-white/60 mt-1">
            {services.length} service{services.length !== 1 ? 's' : ''} monitored
          </p>
        </div>
      </div>
    </div>
  );
}
