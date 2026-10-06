'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Search,
  Truck,
  Image as ImageIcon,
  FileText,
  Clock,
  Filter,
  Package,
} from 'lucide-react';

interface CollectorTaskHistoryProps {
  initialTasks: any[];
}

export function CollectorTaskHistory({ initialTasks }: CollectorTaskHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredTasks = useMemo(() => {
    return initialTasks.filter((t) => {
      const category = t.request?.wasteType || t.report?.category || 'General';
      if (categoryFilter !== 'ALL' && category !== categoryFilter) return false;

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
  }, [initialTasks, categoryFilter, searchQuery]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialTasks.forEach((t) => {
      const c = t.request?.wasteType || t.report?.category;
      if (c) set.add(c);
    });
    return Array.from(set);
  }, [initialTasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Collection Task History
          </h1>
          <p className="text-xs text-slate-400">
            Archive of completed waste collection tasks assigned to and finished by your account.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold">
          <Truck className="w-4 h-4" />
          <span>Total Completed: {initialTasks.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history by address, citizen, or task ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Waste Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List of Completed Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No History Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {initialTasks.length === 0
              ? 'You have not completed any collection tasks yet.'
              : 'No completed tasks match your search filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((t) => {
            const req = t.request;
            const rep = t.report;
            const wasteType = req?.wasteType || rep?.category || 'Mixed Waste';
            const citizen = req?.citizen || rep?.reporter;

            return (
              <div
                key={t.id}
                className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{wasteType} Collection</h3>
                        <span className="text-xs text-slate-400 font-mono">#{t.id.slice(-8)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Citizen: <span className="font-semibold text-slate-200">{citizen?.name || 'Citizen'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      COMPLETED
                    </span>
                    <Link
                      href={`/dashboard/collector/tasks/${t.id}`}
                      className="glass-button-secondary text-xs py-1.5 px-3 text-slate-300 hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{t.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Started: {t.startedAt ? new Date(t.startedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Completed: {t.completedAt ? new Date(t.completedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                {/* Proof & Notes Preview */}
                {(t.proofImageUrl || t.notes) && (
                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {t.proofImageUrl && (
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-sky-400" />
                          Collection Proof Photo
                        </span>
                        <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-800 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    {t.notes && (
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-purple-400" />
                          Collector Field Notes
                        </span>
                        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 h-28 overflow-y-auto">
                          {t.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
