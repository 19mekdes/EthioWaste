'use client';

import React, { useState } from 'react';
import { ListCheck, Search, Truck, Calendar, MapPin, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';

interface AdminCollectionTasksPortalProps {
  initialTasks: any[];
}

export function AdminCollectionTasksPortal({ initialTasks }: AdminCollectionTasksPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTasks = initialTasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCollector = t.collector?.name?.toLowerCase().includes(q);
      const matchAddr = t.address?.toLowerCase().includes(q);
      const matchId = t.id?.toLowerCase().includes(q);
      if (!matchCollector && !matchAddr && !matchId) return false;
    }
    return true;
  });

  const mapMarkers: MapMarker[] = filteredTasks.map((t) => ({
    id: t.id,
    title: `Task #${t.id.slice(-6)} - ${t.collector?.name || 'Collector'}`,
    latitude: t.latitude,
    longitude: t.longitude,
    address: t.address,
    type: 'PICKUP',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ListCheck className="w-6 h-6 text-purple-400" />
            Collection Tasks & Dispatch Monitoring
          </h1>
          <p className="text-xs text-slate-400">
            Real-time tracking of active, assigned, and completed collection tasks assigned to field crews.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 border-slate-800 bg-slate-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by collector name, location, or task ID..."
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
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COLLECTED">COLLECTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Heatmap of Active Tasks */}
      <div className="glass-card p-4 space-y-3 border-slate-800 bg-slate-900/60">
        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-400" />
          <span>Field Task Locations Map</span>
        </div>
        <InteractiveMap
          markers={mapMarkers}
          height="320px"
          centerLat={9.0200}
          centerLng={38.7600}
          zoom={12}
        />
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <ListCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No collection tasks found in system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={task.collector?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={task.collector?.name}
                    className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">{task.collector?.name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">Task #{task.id.slice(-8)}</div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getTaskStatusBadgeStyle(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{task.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}</span>
                </div>
                {task.request && (
                  <div className="text-[11px] text-sky-400 pt-1">
                    Linked Request: {task.request.wasteType} Waste (Citizen: {task.request.citizen?.name})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
