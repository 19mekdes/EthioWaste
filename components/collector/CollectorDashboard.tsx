'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { TaskRouteMap, CollectorTask } from '@/components/collector/TaskRouteMap';

interface CollectorDashboardProps {
  collectorName: string;
  initialTasks: CollectorTask[];
}

export function CollectorDashboard({ collectorName, initialTasks }: CollectorDashboardProps) {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);

  return (
    <TaskRouteMap
      tasks={initialTasks}
      collectorName={collectorName}
      onTaskUpdated={refresh}
    />
  );
}

export function CollectorDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-card p-6 h-28 bg-slate-900/50" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[520px] bg-slate-900/50 rounded-2xl border border-slate-800" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-900/50 rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    </div>
  );
}


