'use client';

import React from 'react';
import {
  Users,
  Truck,
  AlertOctagon,
  Clock,
  CheckCircle2,
  ListCheck,
  MessageSquare,
  Factory,
  MapPin,
  TrendingUp,
  Award,
} from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { AdminReportItem } from './ReportValidationQueue';

export interface ExtendedAdminStats {
  totalCitizens: number;
  totalCollectors: number;
  totalRecyclingOrgs: number;
  totalRecyclingCenters: number;
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  assignedRequests: number;
  activeCollections: number;
  completedCollections: number;
  openComplaints: number;
  resolutionRate: number;
  totalPointsDistributed: number;
}

interface AnalyticsOverviewProps {
  stats: ExtendedAdminStats;
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

  const kpis = [
    { label: 'Total Citizens', value: stats.totalCitizens, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Collectors', value: stats.totalCollectors, icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Waste Reports', value: stats.totalReports, icon: AlertOctagon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: Clock, color: 'text-amber-300', bg: 'bg-amber-500/20' },
    { label: 'Reports In Progress', value: stats.inProgressReports, icon: ListCheck, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Completed Reports', value: stats.resolvedReports, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Approved Requests', value: stats.approvedRequests, icon: CheckCircle2, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Assigned Requests', value: stats.assignedRequests, icon: Truck, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Collections', value: stats.activeCollections, icon: ListCheck, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Completed Collections', value: stats.completedCollections, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Open Complaints', value: stats.openComplaints, icon: MessageSquare, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Recycling Orgs', value: stats.totalRecyclingOrgs, icon: Factory, color: 'text-blue-300', bg: 'bg-blue-500/10' },
    { label: 'Recycling Centers', value: stats.totalRecyclingCenters, icon: MapPin, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Real Operational KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-card p-3.5 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{kpi.label}</span>
              <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className={`text-xl font-black ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Map Heatmap */}
      <div className="glass-card p-5 space-y-4 border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Citywide Waste & Incident Spatial Map
            </h3>
            <p className="text-xs text-slate-400">Live spatial overview of all geo-tagged reports and drop hubs</p>
          </div>
          <div className="text-xs text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Resolution Rate: {stats.resolutionRate}%
          </div>
        </div>

        <InteractiveMap
          markers={mapMarkers}
          height="420px"
          centerLat={9.0200}
          centerLng={38.7600}
          zoom={12}
        />
      </div>
    </div>
  );
}
