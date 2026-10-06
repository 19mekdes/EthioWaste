'use client';

import React from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Award,
  Activity,
  MapPin,
} from 'lucide-react';

interface CollectorProfileProps {
  collector: any;
}

export function CollectorProfile({ collector }: CollectorProfileProps) {
  if (!collector) {
    return (
      <div className="glass-card p-12 text-center text-slate-400">
        Collector profile information could not be loaded.
      </div>
    );
  }

  const completionRate =
    collector.totalAssigned > 0
      ? Math.round((collector.completedTasks / collector.totalAssigned) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-purple-400/30 shadow-xl shadow-purple-600/20 shrink-0">
          {collector.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={collector.avatarUrl}
              alt={collector.name}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            collector.name?.slice(0, 2).toUpperCase() || 'CO'
          )}
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{collector.name}</h1>
              <p className="text-xs text-slate-400">Waste Management & Field Operations Collector</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5 self-center sm:self-auto">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Role: {collector.role}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{collector.email}</span>
            </div>
            {collector.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{collector.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined: {new Date(collector.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Assigned</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{collector.totalAssigned}</p>
          <span className="text-[10px] text-slate-400">All-time task queue</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active Tasks</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400">{collector.activeTasks}</p>
          <span className="text-[10px] text-slate-400">Assigned / In Progress</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{collector.completedTasks}</p>
          <span className="text-[10px] text-slate-400">Successfully finalized</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completion Rate</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400">{completionRate}%</p>
          <span className="text-[10px] text-slate-400">Efficiency rating</span>
        </div>
      </div>

      {/* Account Security Information Card */}
      <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          Field Account & Authorization Details
        </h3>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block mb-1">Account ID</span>
              <span className="font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800 block text-[11px] truncate">
                {collector.id}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Assigned Operational District</span>
              <span className="font-semibold text-slate-200 bg-slate-950/60 p-2 rounded-lg border border-slate-800 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                {collector.address || 'Central Metropolitan Route'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 text-xs">
            <p className="font-semibold mb-0.5">🔒 Server-Side Role Protection</p>
            <p className="text-slate-400 text-[11px]">
              Your account is authenticated via server-side session controls. Role modifications are restricted to Municipal Platform Administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
