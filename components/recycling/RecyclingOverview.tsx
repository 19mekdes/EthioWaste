'use client';

import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  Boxes,
  Clock,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  MapPin,
  Building2,
  Package,
} from 'lucide-react';

interface RecyclingOverviewProps {
  user: any;
  stats: any;
  recentRecords: any[];
  org: any;
}

export function RecyclingOverview({ user, stats, recentRecords, org }: RecyclingOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-500/10 shrink-0">
            ♻️
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">
              Recycling Operations Facility
            </div>
            <h1 className="text-2xl font-extrabold text-white">{org?.name || user.name}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{org?.address || 'Industrial Zone, Addis Ababa'}</span>
              <span>·</span>
              <span>Status: <strong className="text-emerald-400">ACTIVE</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/recycling/materials"
            className="glass-button-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
          >
            <Boxes className="w-4 h-4" />
            <span>Receive Materials</span>
          </Link>
          <Link
            href="/dashboard/recycling/records"
            className="glass-button-secondary text-xs py-2 px-4 text-slate-300 hover:text-white"
          >
            <span>View All Records</span>
          </Link>
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{stats.pendingCount}</p>
          <span className="text-[10px] text-slate-400">Awaiting acceptance</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Accepted</span>
            <FileCheck2 className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400">{stats.acceptedCount}</p>
          <span className="text-[10px] text-slate-400">In inventory</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Processing</span>
            <Recycle className="w-4 h-4 text-purple-400 animate-spin-slow" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400">{stats.processingCount}</p>
          <span className="text-[10px] text-slate-400">Currently in plant</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Recycled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.recycledCount}</p>
          <span className="text-[10px] text-slate-400">Finished materials</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Output</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalRecycledQuantity.toLocaleString()} kg</p>
          <span className="text-[10px] text-slate-400">Cumulative recycled weight</span>
        </div>
      </div>

      {/* Available Materials Banner (if any) */}
      {stats.availableTasksCount > 0 && (
        <div className="glass-card p-4 border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-100">
                {stats.availableTasksCount} Collected Waste Batch(es) Available
              </h4>
              <p className="text-slate-300 text-[11px]">
                Field collectors have completed pickups that are ready to be received into your recycling plant.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/recycling/materials"
            className="glass-button-primary py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 text-xs flex items-center gap-1"
          >
            <span>Review & Receive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Processing Records Table */}
      <div className="glass-card p-6 border-slate-800 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            Recent Recycling Records
          </h3>
          <Link
            href="/dashboard/recycling/records"
            className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRecords.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 space-y-2">
            <Package className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No recycling records created yet.</p>
            <Link
              href="/dashboard/recycling/materials"
              className="inline-block text-xs text-emerald-400 hover:underline font-semibold"
            >
              Receive incoming collected materials →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Material Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Source Citizen</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentRecords.map((r) => {
                  const citizen = r.collectionTask?.request?.citizen || r.collectionTask?.report?.reporter;

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-all">
                      <td className="p-3 font-mono text-slate-400">#{r.id.slice(-8)}</td>
                      <td className="p-3">
                        <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md">
                          {r.material}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-100">
                        {r.quantity} {r.unit}
                      </td>
                      <td className="p-3 text-slate-300">{citizen?.name || 'Municipal Collection'}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getRecyclingStatusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/dashboard/recycling/records/${r.id}`}
                          className="glass-button-secondary text-[11px] py-1 px-3 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          Process Record
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getRecyclingStatusBadge(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'ACCEPTED':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'PROCESSING':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse';
    case 'RECYCLED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
