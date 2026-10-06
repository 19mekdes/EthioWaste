'use client';

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Truck, AlertOctagon, MessageSquare, Star, Award, Shield } from 'lucide-react';

interface AdminReportsAnalyticsPortalProps {
  analytics: {
    stats: any;
    reportCategoryBreakdown: Record<string, number>;
    reportStatusBreakdown: Record<string, number>;
    requestStatusBreakdown: Record<string, number>;
    complaintStatusBreakdown: Record<string, number>;
    feedbackSummary: any;
  };
}

export function AdminReportsAnalyticsPortal({ analytics }: AdminReportsAnalyticsPortalProps) {
  const { stats, reportCategoryBreakdown, reportStatusBreakdown, requestStatusBreakdown, complaintStatusBreakdown, feedbackSummary } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Municipal Operational Analytics & Performance
          </h1>
          <p className="text-xs text-slate-400">
            Citywide statistics aggregated from active waste reports, collection requests, complaints, and citizen reviews.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-amber-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">{stats.resolutionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.resolvedReports} of {stats.totalReports} waste reports resolved
          </div>
        </div>

        <div className="glass-card p-5 border-sky-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Field Collections</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-300">{stats.activeCollections}</div>
          <div className="text-[11px] text-slate-400 mt-1">Currently assigned or in-progress</div>
        </div>

        <div className="glass-card p-5 border-emerald-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Deliveries</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-300">{stats.completedCollections}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total completed tasks & resolved reports</div>
        </div>

        <div className="glass-card p-5 border-purple-500/20 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Citizen Service Rating</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-300">{feedbackSummary?.avgRating || 0} / 5.0</div>
          <div className="text-[11px] text-slate-400 mt-1">From {feedbackSummary?.totalReviews || 0} citizen reviews</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Reports Category Breakdown */}
        <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            Waste Reports by Category
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(reportCategoryBreakdown).map(([cat, count]) => {
              const pct = stats.totalReports > 0 ? Math.round((count / stats.totalReports) * 100) : 0;
              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{cat}</span>
                    <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collection Requests Status Breakdown */}
        <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Truck className="w-4 h-4 text-sky-400" />
            Collection Requests Status Pipeline
          </h3>
          <div className="space-y-2 pt-1">
            {Object.entries(requestStatusBreakdown).map(([st, count]) => {
              const pct = stats.totalRequests > 0 ? Math.round((count / stats.totalRequests) * 100) : 0;
              return (
                <div key={st} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{st}</span>
                    <span className="font-mono text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaints Status Breakdown */}
        <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <MessageSquare className="w-4 h-4 text-rose-400" />
            Complaints Status Breakdown
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center text-xs pt-1">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-slate-400 block text-[11px]">OPEN</span>
              <span className="font-black text-amber-400 text-xl">{complaintStatusBreakdown.OPEN || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <span className="text-slate-400 block text-[11px]">IN_REVIEW</span>
              <span className="font-black text-sky-400 text-xl">{complaintStatusBreakdown.IN_REVIEW || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-slate-400 block text-[11px]">RESOLVED</span>
              <span className="font-black text-emerald-400 text-xl">{complaintStatusBreakdown.RESOLVED || 0}</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-slate-400 block text-[11px]">REJECTED</span>
              <span className="font-black text-rose-400 text-xl">{complaintStatusBreakdown.REJECTED || 0}</span>
            </div>
          </div>
        </div>

        {/* Citizen Rating Distribution */}
        <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Star className="w-4 h-4 text-purple-400" />
            Citizen Review Rating Distribution
          </h3>
          <div className="space-y-2 pt-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = feedbackSummary?.ratingDistribution?.[stars] || 0;
              const pct = feedbackSummary?.totalReviews > 0 ? Math.round((count / feedbackSummary.totalReviews) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-amber-400 font-bold shrink-0">{stars} Stars</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-400 font-mono shrink-0">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
