'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  Recycle,
  Tag,
  MapPin,
  Calendar,
} from 'lucide-react';

interface RecyclingRecordsListProps {
  initialRecords: any[];
}

export function RecyclingRecordsList({ initialRecords }: RecyclingRecordsListProps) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = useMemo(() => {
    return initialRecords.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (materialFilter !== 'ALL' && r.material !== materialFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id?.toLowerCase().includes(q);
        const matchNotes = r.notes?.toLowerCase().includes(q);
        const matchAddr = r.collectionTask?.address?.toLowerCase().includes(q);
        const matchCitizen =
          r.collectionTask?.request?.citizen?.name?.toLowerCase().includes(q) ||
          r.collectionTask?.report?.reporter?.name?.toLowerCase().includes(q);

        if (!matchId && !matchNotes && !matchAddr && !matchCitizen) return false;
      }
      return true;
    });
  }, [initialRecords, statusFilter, materialFilter, searchQuery]);

  const materials = useMemo(() => {
    const set = new Set<string>();
    initialRecords.forEach((r) => {
      if (r.material) set.add(r.material);
    });
    return Array.from(set);
  }, [initialRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            Facility Recycling Records
          </h1>
          <p className="text-xs text-slate-400">
            Track and process material records across the 4 lifecycle stages: PENDING → ACCEPTED → PROCESSING → RECYCLED.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search records by ID, citizen, notes, address..."
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
              <option value="ALL">All Lifecycle Statuses</option>
              <option value="PENDING">PENDING (Material Received)</option>
              <option value="ACCEPTED">ACCEPTED (In Inventory)</option>
              <option value="PROCESSING">PROCESSING (In Plant)</option>
              <option value="RECYCLED">RECYCLED (Completed Output)</option>
            </select>
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

      {/* Record List */}
      {filteredRecords.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Recycling Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {initialRecords.length === 0
              ? 'Your organization has not created any recycling records yet.'
              : 'No records match your selected filter parameters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((r) => {
            const citizen = r.collectionTask?.request?.citizen || r.collectionTask?.report?.reporter;
            const address = r.collectionTask?.address;

            return (
              <div
                key={r.id}
                className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{r.material} Recycling</h3>
                        <span className="text-xs text-slate-400 font-mono">#{r.id.slice(-8)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Citizen Source: <span className="font-semibold text-slate-200">{citizen?.name || 'Municipal Field Pickup'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRecyclingStatusBadge(r.status)}`}>
                      {r.status}
                    </span>
                    <Link
                      href={`/dashboard/recycling/records/${r.id}`}
                      className="glass-button-primary text-xs py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                    >
                      <span>Manage Record</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Quantity: <strong className="text-slate-100">{r.quantity} {r.unit}</strong></span>
                  </div>
                  {address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Updated: {new Date(r.updatedAt).toLocaleString()}</span>
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
