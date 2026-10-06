'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  MapPin,
  Calendar,
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  Tag,
  AlertOctagon,
} from 'lucide-react';

interface MyCollectorTasksListProps {
  initialTasks: any[];
}

export function MyCollectorTasksList({ initialTasks }: MyCollectorTasksListProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL') {
        const priority = t.request?.priority || t.report?.severity;
        if (priority !== priorityFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAddr = t.address?.toLowerCase().includes(q);
        const matchId = t.id?.toLowerCase().includes(q);
        const matchCitizen =
          t.request?.citizen?.name?.toLowerCase().includes(q) ||
          t.report?.reporter?.name?.toLowerCase().includes(q);
        if (!matchAddr && !matchId && !matchCitizen) return false;
      }
      return true;
    });
  }, [initialTasks, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-purple-400" />
            My Assigned Field Tasks
          </h1>
          <p className="text-xs text-slate-400">
            View active, pending, and in-progress waste collection tasks assigned strictly to your account.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by address, citizen, or task ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Task Statuses</option>
              <option value="ASSIGNED">ASSIGNED (Pending Start)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (En Route / Active)</option>
              <option value="COLLECTED">COLLECTED (Pickup Done)</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <Truck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Assigned Tasks Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {initialTasks.length === 0
              ? "You do not have any collection tasks assigned at this moment."
              : "No tasks match your selected filter options."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => {
            const req = t.request;
            const rep = t.report;
            const wasteType = req?.wasteType || rep?.category || 'Mixed Waste';
            const priority = req?.priority || rep?.severity || 'MEDIUM';
            const citizen = req?.citizen || rep?.reporter;

            return (
              <div
                key={t.id}
                className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-purple-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{wasteType} Collection</h3>
                        <span className="text-xs text-slate-400 font-mono">#{t.id.slice(-8)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Citizen: <span className="font-semibold text-slate-200">{citizen?.name || 'Citizen'}</span> ({citizen?.phone || citizen?.email || 'N/A'})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTaskBadgeStyle(t.status)}`}>
                      {t.status}
                    </span>
                    <Link
                      href={`/dashboard/collector/tasks/${t.id}`}
                      className="glass-button-primary text-xs py-1.5 px-3.5 bg-purple-600 text-white font-bold flex items-center gap-1"
                    >
                      <span>{t.status === 'ASSIGNED' ? 'Start Task' : 'Open Execution Screen'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{t.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Scheduled: {new Date(t.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertOctagon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Priority: {priority}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTaskBadgeStyle(status: string) {
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
