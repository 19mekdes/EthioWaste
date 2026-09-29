'use client';

import React, { useState } from 'react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { Truck, MapPin, CheckCircle2, Clock, AlertTriangle, Navigation, Camera, Play } from 'lucide-react';
import { getSeverityBadge, getStatusBadge } from '@/lib/utils';
import { updateReportStatus } from '@/actions/reports';
import { PostCleanupModal } from './PostCleanupModal';

export interface CollectorTask {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl: string;
  cleanupImageUrl?: string | null;
  createdAt: string | Date;
  reporter?: { name: string; avatarUrl?: string | null } | null;
}

interface TaskRouteMapProps {
  tasks: CollectorTask[];
  collectorName?: string;
  onTaskUpdated?: () => void;
}

export function TaskRouteMap({ tasks, collectorName = 'Marcus Vance', onTaskUpdated }: TaskRouteMapProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined);
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
  });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const mapMarkers: MapMarker[] = filteredTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    severity: t.severity,
    status: t.status,
    latitude: t.latitude,
    longitude: t.longitude,
    imageUrl: t.imageUrl,
    address: t.address || undefined,
    type: 'REPORT',
  }));

  const handleStartTask = async (taskId: string) => {
    setUpdatingId(taskId);
    await updateReportStatus(taskId, 'IN_PROGRESS');
    setUpdatingId(null);
    if (onTaskUpdated) onTaskUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Verification Modal */}
      {verifyingTaskId && selectedTask && (
        <PostCleanupModal
          reportId={verifyingTaskId}
          reportTitle={selectedTask.title}
          onSuccess={() => {
            setVerifyingTaskId(null);
            if (onTaskUpdated) onTaskUpdated();
          }}
          onClose={() => setVerifyingTaskId(null)}
        />
      )}

      {/* Top Header Card */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border-sky-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-500/10">
            🚚
          </div>
          <div>
            <div className="text-xs text-sky-400 font-semibold uppercase tracking-wider mb-0.5">
              Field Staff Route Dashboard
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">{collectorName}'s Collection Route</h2>
            <p className="text-xs text-slate-400">View assigned tasks, navigate route map, and submit cleanup verifications</p>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterStatus === st
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Map & Task Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Route Map */}
        <div className="lg:col-span-2 space-y-4">
          <InteractiveMap
            markers={mapMarkers}
            selectedMarkerId={selectedTaskId}
            onMarkerClick={(m) => setSelectedTaskId(m.id)}
            height="520px"
            centerLat={40.7580}
            centerLng={-73.9855}
            zoom={12}
          />
        </div>

        {/* Task List Panel */}
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Assigned Collection Queue ({filteredTasks.length})
          </div>

          {filteredTasks.length === 0 ? (
            <div className="glass-card p-8 text-center text-xs text-slate-400">
              No tasks match status filter "{filterStatus}".
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              const isUpdating = updatingId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`glass-card p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-950/20 shadow-lg shadow-sky-500/10'
                      : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getSeverityBadge(task.severity)}`}>
                      {task.severity}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-1">{task.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{task.description}</p>

                  {task.address && (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="line-clamp-1">{task.address}</span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {task.status === 'PENDING' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTask(task.id);
                        }}
                        disabled={isUpdating}
                        className="w-full glass-button-primary text-xs py-2 bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-500 hover:to-blue-400 shadow-sky-600/20"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Collection Route</span>
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskId(task.id);
                          setVerifyingTaskId(task.id);
                        }}
                        className="w-full glass-button-primary text-xs py-2 bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-600/20"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Submit Verification Photo</span>
                      </button>
                    )}

                    {task.status === 'RESOLVED' && (
                      <div className="w-full text-center text-xs text-emerald-400 font-semibold py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolved & Verified ✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
