'use client';

import React from 'react';
import { BarChart3, CheckCircle2, AlertOctagon, Truck, Award, Users, TrendingUp } from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { AdminReportItem } from './ReportValidationQueue';

interface AdminStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
  totalCitizens: number;
  totalCollectors: number;
  resolutionRate: number;
  totalPointsDistributed: number;
}

interface AnalyticsOverviewProps {
  stats: AdminStats;
  reports: AdminReportItem[];
}

export function AnalyticsOverview({ stats, reports }: AnalyticsOverviewProps) {
  const mapMarkers: MapMarker[] = reports.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    severity: r.severity,
    status: r.status,
    latitude: r.latitude,
    longitude: r.longitude,
    imageUrl: r.imageUrl,
    address: r.address || undefined,
    type: 'REPORT',
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="glass-card p-5 border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Waste Reports</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{stats.totalReports}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last month</span>
          </div>
        </div>

        <div className="glass-card p-5 border-sky-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{stats.resolutionRate}%</div>
          <div className="text-[11px] text-sky-400 mt-1 font-medium">
            {stats.resolvedReports} of {stats.totalReports} issues resolved
          </div>
        </div>
        <div className="glass-card p-5 border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Field Staff</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{stats.totalCollectors}</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">
            {stats.inProgressReports} tasks currently in progress
          </div>
        </div>

        {/* Eco-Points Distributed Card */}
        <div className="glass-card p-5 border-purple-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Points Distributed</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-100">{stats.totalPointsDistributed} PTS</div>
          <div className="text-[11px] text-purple-400 mt-1 font-medium">
            Awarded across {stats.totalCitizens} registered citizens
          </div>
        </div>
      </div>
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Regional Waste & Pollution Spatial Heatmap
            </h3>
            <p className="text-xs text-slate-400">Citywide map distribution of pending, active, and resolved waste reports</p>
          </div>
        </div>

        <InteractiveMap
          markers={mapMarkers}
          height="450px"
          centerLat={40.7580}
          centerLng={-73.9855}
          zoom={12}
        />
      </div>
    </div>
  );
}
