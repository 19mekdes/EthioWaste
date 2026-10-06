'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Clock,
  Truck,
  CheckCircle2,
  Bell,
  PlusCircle,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { ActiveUser } from '@/components/ui/RoleSwitcher';

interface CitizenOverviewProps {
  user: ActiveUser;
  stats: {
    totalReports: number;
    pendingReports: number;
    activeCollectionRequests: number;
    completedCollections: number;
    unreadNotificationsCount: number;
  };
  recentNotifications: any[];
  recentReports: any[];
  recentRequests: any[];
}

export function CitizenOverview({
  user,
  stats,
  recentNotifications,
  recentReports,
  recentRequests,
}: CitizenOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
              Authenticated Citizen Portal
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-400">
              Track your waste reports, manage collection requests, and monitor environmental cleanup activities.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/citizen/report-waste" className="glass-button-primary text-xs py-2 px-3.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Report Waste</span>
          </Link>
          <Link href="/dashboard/citizen/collection-request" className="glass-button-secondary text-xs py-2 px-3.5">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Request Collection</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="glass-card p-4 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalReports}</div>
          <div className="text-[11px] text-slate-400 mt-1">Submitted waste & dumping reports</div>
        </div>

        {/* Pending Reports */}
        <div className="glass-card p-4 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reports</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.pendingReports}</div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting admin verification</div>
        </div>

        {/* Active Collection Requests */}
        <div className="glass-card p-4 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Requests</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400">{stats.activeCollectionRequests}</div>
          <div className="text-[11px] text-slate-400 mt-1">In pickup pipeline</div>
        </div>

        {/* Completed Collections */}
        <div className="glass-card p-4 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.completedCollections}</div>
          <div className="text-[11px] text-slate-400 mt-1">Resolved collections & reports</div>
        </div>
      </div>

      {/* Two Column Layout: Recent Reports & Collection Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Waste Reports */}
        <div className="glass-card p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Recent Waste Reports
            </h3>
            <Link
              href="/dashboard/citizen/reports"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No waste reports submitted yet.</p>
              <Link href="/dashboard/citizen/report-waste" className="text-xs text-emerald-400 underline font-medium">
                Submit your first report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200 truncate">{report.title}</span>
                      {report.isIllegalDumping && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Illegal Dumping
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {report.address || 'Geo-pinned'}
                      </span>
                      <span>•</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Collection Requests */}
        <div className="glass-card p-5 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400" />
              Recent Collection Requests
            </h3>
            <Link
              href="/dashboard/citizen/requests"
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Truck className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No collection requests created yet.</p>
              <Link href="/dashboard/citizen/collection-request" className="text-xs text-sky-400 underline font-medium">
                Request a waste pickup
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/dashboard/citizen/requests/${req.id}`}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-all flex items-center justify-between gap-3 block"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{req.wasteType} Waste</span>
                      {req.estimatedQuantity && (
                        <span className="text-[10px] text-slate-400 font-mono">({req.estimatedQuantity})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" /> {new Date(req.preferredDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{req.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeStyle(req.status)}`}>
                      {req.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Notifications Feed */}
      <div className="glass-card p-5 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Recent Notifications
          </h3>
          <Link
            href="/dashboard/citizen/notifications"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            Notifications Feed ({stats.unreadNotificationsCount} unread) <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentNotifications.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No notifications yet. You will receive updates as your reports and requests progress.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                  !notif.isRead
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800/80'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">{notif.title}</div>
                  <div className="text-xs text-slate-300">{notif.message}</div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'VERIFIED':
    case 'APPROVED':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'ASSIGNED':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'IN_PROGRESS':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse';
    case 'COLLECTED':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
