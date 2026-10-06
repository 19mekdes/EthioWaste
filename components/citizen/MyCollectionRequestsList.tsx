'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Filter,
  Calendar,
  MapPin,
  UserCheck,
  ChevronRight,
  PlusCircle,
  Tag,
  Clock,
} from 'lucide-react';
import { CollectionRequestStatus } from '@prisma/client';

interface MyCollectionRequestsListProps {
  initialRequests: any[];
}

export function MyCollectionRequestsList({ initialRequests }: MyCollectionRequestsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    return initialRequests.filter((req) => {
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchType = req.wasteType?.toLowerCase().includes(q);
        const matchAddr = req.address?.toLowerCase().includes(q);
        const matchId = req.id?.toLowerCase().includes(q);
        if (!matchType && !matchAddr && !matchId) return false;
      }
      return true;
    });
  }, [initialRequests, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-400" />
            My Collection Requests
          </h1>
          <p className="text-xs text-slate-400">
            Track status lifecycle from submission to approval, assignment, and completion.
          </p>
        </div>
        <Link href="/dashboard/citizen/collection-request" className="glass-button-primary text-xs py-2 px-4">
          <PlusCircle className="w-4 h-4 text-sky-400" />
          Request Waste Pickup
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by request ID, waste type, or address..."
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
              <option value="ALL">All Request Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COLLECTED">COLLECTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-3">
          <Truck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Collection Requests Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {initialRequests.length === 0
              ? "You haven't requested any waste collections yet."
              : 'No collection requests match your filter criteria.'}
          </p>
          {initialRequests.length === 0 && (
            <div className="pt-2">
              <Link href="/dashboard/citizen/collection-request" className="glass-button-primary text-xs py-2 px-4 inline-flex">
                Create First Collection Request
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-sky-500/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{req.wasteType} Waste Collection</h3>
                      <span className="text-xs text-slate-400 font-mono">#{req.id.slice(-8)}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Requested on {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyle(req.status)}`}>
                    {req.status}
                  </span>
                  <Link
                    href={`/dashboard/citizen/requests/${req.id}`}
                    className="glass-button-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <span>Track Progress</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Status Lifecycle Indicator */}
              <div className="py-1">
                <StatusTimelineMini status={req.status} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/40">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{req.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Pref: {new Date(req.preferredDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>
                    Collector: {req.assignedCollector ? req.assignedCollector.name : 'Not yet assigned'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusTimelineMini({ status }: { status: CollectionRequestStatus }) {
  const stages = ['PENDING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'COLLECTED', 'COMPLETED'];
  const currentIndex = stages.indexOf(status);

  if (status === 'REJECTED') {
    return (
      <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 inline-block">
        Request Rejected by Municipal Admin
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1 text-[10px]">
      {stages.map((stage, idx) => {
        const isPast = idx <= currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={stage}>
            <span
              className={`px-2 py-0.5 rounded-md font-bold transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-sky-500 text-slate-950 shadow-sm shadow-sky-500/30 ring-2 ring-sky-400/50'
                  : isPast
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-slate-800/60 text-slate-500'
              }`}
            >
              {stage.replace('_', ' ')}
            </span>
            {idx < stages.length - 1 && (
              <span className={`w-3 h-0.5 shrink-0 ${isPast && idx < currentIndex ? 'bg-sky-500' : 'bg-slate-800'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
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
