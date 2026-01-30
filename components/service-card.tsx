'use client';

import { DetailedHealth } from '@/lib/types';

interface StatusBadgeProps {
  status: 'healthy' | 'unhealthy' | 'degraded' | undefined;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const statusConfig = {
    healthy: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      label: 'Healthy',
    },
    degraded: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
      label: 'Degraded',
    },
    unhealthy: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      dot: 'bg-red-400',
      label: 'Unhealthy',
    },
    undefined: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      dot: 'bg-gray-400',
      label: 'Unknown',
    },
  };

  const config = statusConfig[status || 'undefined'];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} font-medium`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}

interface ServiceCardProps {
  name: string;
  health?: DetailedHealth;
  loading: boolean;
  error?: string;
}

export function ServiceCard({ name, health, loading, error }: ServiceCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="h-6 w-32 rounded bg-white/10 mb-4" />
          <div className="h-4 w-24 rounded bg-white/10 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        <StatusBadge status="unhealthy" />
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <StatusBadge status={health?.status} size="lg" />
      </div>

      {health && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard
              label="Uptime"
              value={formatUptime(health.uptime)}
              icon="clock"
            />
            <MetricCard
              label="Memory"
              value={`${health.metrics.memoryUsage}%`}
              icon="memory"
              warn={health.metrics.memoryUsage > 80}
            />
            <MetricCard
              label="Failed Flashes"
              value={health.metrics.failedFlashes.toString()}
              icon="alert"
              warn={health.metrics.failedFlashes > 0}
            />
            <MetricCard
              label="Last Sync"
              value={formatLastSync(health.lastSync)}
              icon="sync"
            />
          </div>

          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-white/60 mb-3">Service Checks</h4>
            <div className="grid grid-cols-2 gap-2">
              <CheckItem label="Database" status={health.checks.database} responseTime={health.responseTimes.database} />
              <CheckItem label="RabbitMQ" status={health.checks.rabbitmq} responseTime={health.responseTimes.rabbitmq} />
              <CheckItem label="Space Invaders API" status={health.checks.spaceInvadersAPI} responseTime={health.responseTimes.api} />
              <CheckItem label="Disk" status={health.checks.diskPersistence} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  warn?: boolean;
}

function MetricCard({ label, value, warn }: MetricCardProps) {
  return (
    <div className={`rounded-lg border p-3 ${warn ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/10 bg-white/5'}`}>
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${warn ? 'text-amber-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

interface CheckItemProps {
  label: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
}

function CheckItem({ label, status, responseTime }: CheckItemProps) {
  const statusColors = {
    healthy: 'text-emerald-400',
    degraded: 'text-amber-400',
    unhealthy: 'text-red-400',
  };

  const statusIcons = {
    healthy: 'M5 13l4 4L19 7',
    degraded: 'M12 9v2m0 4h.01',
    unhealthy: 'M6 18L18 6M6 6l12 12',
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
      <div className="flex items-center gap-2">
        <svg className={`w-4 h-4 ${statusColors[status]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statusIcons[status]} />
        </svg>
        <span className="text-sm text-white/80">{label}</span>
      </div>
      {responseTime !== undefined && (
        <span className="text-xs text-white/40">{responseTime}ms</span>
      )}
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatLastSync(timestamp: string): string {
  if (timestamp === 'never' || timestamp === 'unknown') return timestamp;
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  } catch {
    return timestamp;
  }
}
