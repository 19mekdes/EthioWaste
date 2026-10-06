'use client';

import React from 'react';
import Link from 'next/link';
import {
  Truck,
  Clock,
  CheckCircle2,
  ListCheck,
  MapPin,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  User,
} from 'lucide-react';
import { ActiveUser } from '@/components/ui/RoleSwitcher';

interface CollectorOverviewProps {
  user: ActiveUser;
  stats: {
    totalTasks: number;
    pendingTasks: number;
    activeTasks: number;
    collectedTasks: number;
    completedTasks: number;
    cancelledTasks: number;
    completionRate: number;
  };
  todayTasks: any[];
}

export function CollectorOverview({ user, stats, todayTasks }: CollectorOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/10">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-0.5">
              Field Crew Operations
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Welcome back, {user.name.split(' ')[0]} 🚚
            </h1>
            <p className="text-xs text-slate-400">
              Manage door-to-door pickups, execute collection tasks, and document cleanup proof.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/collector/tasks"
          className="glass-button-primary text-xs py-2 px-4 bg-purple-600 text-white font-bold"
        >
          <Truck className="w-4 h-4" />
          <span>Go to My Tasks ({stats.pendingTasks + stats.activeTasks})</span>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Pending</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300">{stats.pendingTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting collection start</div>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ListCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400">{stats.activeTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">En route or collecting</div>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.completedTasks}</div>
          <div className="text-[11px] text-slate-400 mt-1">Documented with proof</div>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300">{stats.completionRate}%</div>
          <div className="text-[11px] text-slate-400 mt-1">{stats.completedTasks} of {stats.totalTasks} total tasks</div>
        </div>
      </div>

      {/* Today's Tasks Queue */}
      <div className="glass-card p-5 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Today&apos;s Collection Schedule
          </h2>
          <Link
            href="/dashboard/collector/tasks"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            View All Tasks <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Truck className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No collection tasks scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((t) => {
              const req = t.request || t.report;
              const citizenName = t.request?.citizen?.name || t.report?.reporter?.name || 'Citizen';
              return (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {t.request ? `${t.request.wasteType} Waste` : t.report ? t.report.title : 'Collection Task'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{t.id.slice(-8)}</span>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-purple-400" />
                      <span>{citizenName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{t.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getTaskStatusBadgeStyle(t.status)}`}>
                      {t.status}
                    </span>
                    <Link
                      href={`/dashboard/collector/tasks/${t.id}`}
                      className="glass-button-primary text-xs py-1.5 px-3 bg-purple-600 text-white font-bold flex items-center gap-1"
                    >
                      <span>Open Task</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getTaskStatusBadgeStyle(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'IN_PROGRESS':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
