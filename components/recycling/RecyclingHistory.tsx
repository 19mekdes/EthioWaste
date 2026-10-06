'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Calendar,
  Search,
  Recycle,
  Tag,
  MapPin,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface RecyclingHistoryProps {
  initialRecords: any[];
}

export function RecyclingHistory({ initialRecords }: RecyclingHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('ALL');

  const filteredRecords = useMemo(() => {
    return initialRecords.filter((r) => {
      if (materialFilter !== 'ALL' && r.material !== materialFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id?.toLowerCase().includes(q);
        const matchNotes = r.notes?.toLowerCase().includes(q);
        const matchAddr = r.collectionTask?.address?.toLowerCase().includes(q);

        if (!matchId && !matchNotes && !matchAddr) return false;
      }
      return true;
    });
  }, [initialRecords, materialFilter, searchQuery]);

  const materials = useMemo(() => {
    const set = new Set<string>();
    initialRecords.forEach((r) => {
      if (r.material) set.add(r.material);
    });
    return Array.from(set);
  }, [initialRecords]);

  const totalRecycledWeight = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + (r.quantity || 0), 0);
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Recycling Processing History
          </h1>
          <p className="text-xs text-slate-400">
            Archive of successfully transformed and recycled material batches.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold">
          <Recycle className="w-4 h-4" />
          <span>Total Output: {totalRecycledWeight.toLocaleString()} kg</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history by ID, notes, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="w-full glass-input text-xs"
            >
              <option value="ALL">All Material Types</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List of Finished Records */}
      {filteredRecords.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No History Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {initialRecords.length === 0
              ? 'Your facility has not finalized any recycling records yet.'
              : 'No recycled materials match your search parameters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((r) => {
            const citizen = r.collectionTask?.request?.citizen || r.collectionTask?.report?.reporter;

            return (
              <div
                key={r.id}
                className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{r.material} Recycled</h3>
                        <span className="text-xs text-slate-400 font-mono">#{r.id.slice(-8)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Citizen Source: <span className="font-semibold text-slate-200">{citizen?.name || 'Municipal Collection'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      RECYCLED
                    </span>
                    <Link
                      href={`/dashboard/recycling/records/${r.id}`}
                      className="glass-button-secondary text-xs py-1.5 px-3 text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <span>View Record</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Recycled Weight: <strong className="text-white">{r.quantity} {r.unit}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Processed: {r.processedAt ? new Date(r.processedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Finalized: {new Date(r.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {r.notes && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 font-semibold mb-0.5 block">Plant Notes:</span>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      {r.notes}
                    </p>
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
