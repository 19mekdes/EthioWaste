'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { AnalyticsOverview } from '@/components/admin/AnalyticsOverview';
import { ReportValidationQueue, AdminReportItem } from '@/components/admin/ReportValidationQueue';

export interface AdminDashboardData {
  stats: {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
    inProgressReports: number;
    totalCitizens: number;
    totalCollectors: number;
    resolutionRate: number;
    totalPointsDistributed: number;
  };
  reports: AdminReportItem[];
  collectors: any[];
}

interface AdminDashboardProps {
  adminName: string;
  initialData: AdminDashboardData;
}

export function AdminDashboard({ adminName, initialData }: AdminDashboardProps) {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/30 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/10">
          {adminName.charAt(0)}
        </div>
        <div>
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
            Municipal Control Room
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Operations Dashboard, {adminName.split(' ')[0]}</h2>
          <p className="text-xs text-slate-400">
            Citywide KPIs, spatial heatmap, report validation, and field crew dispatch.
          </p>
        </div>
      </div>

      <AnalyticsOverview stats={initialData.stats} reports={initialData.reports} />
      <ReportValidationQueue
        reports={initialData.reports}
        collectors={initialData.collectors}
        onRefresh={refresh}
      />
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="glass-card p-6 h-28 bg-slate-900/50" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900/50 rounded-2xl border border-slate-800" />
        ))}
      </div>
      <div className="h-[450px] bg-slate-900/50 rounded-2xl border border-slate-800" />
      <div className="h-64 bg-slate-900/50 rounded-2xl border border-slate-800" />
    </div>
  );
}


