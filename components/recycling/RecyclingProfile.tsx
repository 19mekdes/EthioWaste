'use client';

import React from 'react';
import {
  Building2,
  Mail,
  Phone,
  Shield,
  Calendar,
  Recycle,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  Tag,
} from 'lucide-react';

interface RecyclingProfileProps {
  profile: any;
}

export function RecyclingProfile({ profile }: RecyclingProfileProps) {
  if (!profile || !profile.org) {
    return (
      <div className="glass-card p-12 text-center text-slate-400">
        Facility profile details could not be loaded.
      </div>
    );
  }

  const { user, org, stats } = profile;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-extrabold text-3xl flex items-center justify-center border-2 border-emerald-400/30 shadow-xl shadow-emerald-600/20 shrink-0">
          ♻️
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-white">{org.name}</h1>
              <p className="text-xs text-slate-400">Authorized Municipal Waste Recycling & Processing Organization</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5 self-center sm:self-auto">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Role: RECYCLING_ORGANIZATION
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{org.contactEmail || user.email}</span>
            </div>
            {org.contactPhone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{org.contactPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{org.address}, {org.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Performance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Active In-Plant Batches</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400">{stats.activeRecords}</p>
          <span className="text-[10px] text-slate-400">Pending / Accepted / Processing</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completed Recycled Batches</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{stats.completedRecords}</p>
          <span className="text-[10px] text-slate-400">Finished transformations</span>
        </div>

        <div className="glass-card p-4 border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Output Recycled</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats.totalRecycledWeight.toLocaleString()} kg</p>
          <span className="text-[10px] text-slate-400">Cumulative processed weight</span>
        </div>
      </div>

      {/* Facility Operational Details */}
      <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400" />
          Facility Specifications & Accepted Categories
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Accepted Material Categories</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {org.acceptedMaterials?.split(',').map((cat: string) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[11px]"
                >
                  {cat.trim()}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-slate-400 block mb-1">Facility Organization ID</span>
              <span className="font-mono text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800 block text-[11px] truncate">
                {org.id}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Operating Status</span>
              <span className="font-semibold text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 block text-xs">
                Active & Certified Processing Facility
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
