'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserCheck, Search, Truck, Phone, Mail, CheckCircle2, ListCheck, Calendar } from 'lucide-react';

interface AdminCollectorsPortalProps {
  initialCollectors: any[];
}

export function AdminCollectorsPortal({ initialCollectors }: AdminCollectorsPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCollectors = initialCollectors.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-400" />
            Field Collector Roster & Management
          </h1>
          <p className="text-xs text-slate-400">
            Monitor active field collectors, task loads, completion rates, and assign new collection dispatches.
          </p>
        </div>
        <Link
          href="/dashboard/admin/requests"
          className="glass-button-primary text-xs py-2 px-4 bg-purple-600 text-white font-bold flex items-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Dispatch Tasks</span>
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collector name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-9 text-xs"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollectors.map((c) => (
          <div key={c.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={c.name}
                  className="w-12 h-12 rounded-full object-cover border border-purple-500/40 bg-slate-950 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{c.name}</h3>
                  <div className="text-xs text-slate-400 truncate">{c.email}</div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Licensed Collector
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                {c.phone && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-purple-400" />
                    <span>Phone: {c.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-600" />
                  <span>Registered: {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Task stats */}
            <div className="pt-3 border-t border-slate-800/60 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-800/60">
                <span className="text-slate-400 block">Total</span>
                <span className="font-bold text-slate-200 text-sm">{c.totalAssigned || 0}</span>
              </div>
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <span className="text-sky-300 block">Active</span>
                <span className="font-bold text-sky-400 text-sm">{c.activeTasks || 0}</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-300 block">Completed</span>
                <span className="font-bold text-emerald-400 text-sm">{c.completedTasks || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
