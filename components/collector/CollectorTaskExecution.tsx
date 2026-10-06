'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { ImageUploadField } from '@/components/ui/ImageUploadField';
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  Play,
  Camera,
  FileText,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  startCollectionTask,
  markCollectionAsCollected,
  completeCollectionTask,
} from '@/actions/collector';

const SAMPLE_PROOF_PHOTOS = [
  {
    label: 'Cleaned Alley Pickup',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Recycling Bin Emptied',
    url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Illegal Dump Cleared',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
  },
];

interface CollectorTaskExecutionProps {
  task: any;
}

export function CollectorTaskExecution({ task }: CollectorTaskExecutionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Execution form states
  const [proofImageUrl, setProofImageUrl] = useState(task.proofImageUrl || '');
  const [notes, setNotes] = useState(task.notes || '');

  const req = task.request;
  const rep = task.report;
  const citizen = req?.citizen || rep?.reporter;
  const wasteType = req?.wasteType || rep?.category || 'Mixed Waste';
  const quantity = req?.estimatedWeight || req?.estimatedVolume || rep?.estimatedSize || 'Standard Pickup';
  const priority = req?.priority || rep?.severity || 'MEDIUM';

  const mapMarkers: MapMarker[] = [
    {
      id: task.id,
      title: `${wasteType} Pickup`,
      description: task.notes || 'Collection location',
      category: wasteType,
      severity: priority,
      status: task.status,
      latitude: task.latitude,
      longitude: task.longitude,
      address: task.address || undefined,
      type: 'PICKUP',
    },
  ];

  const handleStart = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await startCollectionTask(task.id);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Collection started successfully! Request is now IN_PROGRESS.');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to start collection task.');
    }
  };

  const handleMarkCollected = async () => {
    if (!proofImageUrl && !task.proofImageUrl) {
      setErrorMsg('Please attach/upload a collection proof photo before marking as collected.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await markCollectionAsCollected(task.id, proofImageUrl, notes);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Waste marked as collected! Task status is now COLLECTED. Next step: Click Complete Task.');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to mark collection as collected.');
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await completeCollectionTask(task.id, proofImageUrl, notes);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Collection task completed successfully!');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to complete collection task.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/collector/tasks"
          className="glass-button-secondary text-xs py-2 px-3 flex items-center gap-1 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Tasks</span>
        </Link>
        <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${getTaskBadgeStyle(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Truck className="w-6 h-6 text-purple-400" />
              {wasteType} Collection Task
            </h1>
            <span className="text-xs text-slate-400 font-mono">#{task.id.slice(-8)}</span>
          </div>
          <p className="text-xs text-slate-400">
            Field collection execution screen for assigned team member. Record observations & submit proof.
          </p>
        </div>

        {/* Action Button for Header */}
        <div>
          {task.status === 'ASSIGNED' && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-gradient-to-r from-sky-600 to-purple-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Start Collection</span>
            </button>
          )}
          {task.status === 'IN_PROGRESS' && (
            <button
              onClick={handleMarkCollected}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Mark Collected</span>
            </button>
          )}
          {task.status === 'COLLECTED' && (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Complete Task</span>
            </button>
          )}
          {task.status === 'COMPLETED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Task Fully Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="glass-card p-4 border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="glass-card p-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Execution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              Collection Order Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Waste Category</span>
                <span className="font-bold text-slate-100 bg-slate-800/60 px-2.5 py-1 rounded-md inline-block">
                  {wasteType}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Estimated Quantity</span>
                <span className="font-bold text-slate-100 bg-slate-800/60 px-2.5 py-1 rounded-md inline-block">
                  {quantity}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Priority Level</span>
                <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md inline-block">
                  {priority}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Scheduled Collection Date</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(task.scheduledDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description / Instructions */}
            {(req?.description || rep?.description || task.notes) && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-slate-400 block text-xs mb-1 font-semibold">Special Instructions / Description:</span>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {req?.description || rep?.description || task.notes || 'No extra notes provided.'}
                </p>
              </div>
            )}
          </div>

          {/* Location & Map Card */}
          <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Pickup Location & Map Navigation
            </h3>

            <div className="text-xs space-y-1">
              <span className="text-slate-400 font-medium">Pickup Address:</span>
              <p className="text-slate-200 font-semibold text-sm">{task.address}</p>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3 pt-1">
                <span>Lat: {task.latitude.toFixed(5)}</span>
                <span>Lng: {task.longitude.toFixed(5)}</span>
              </div>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              height="350px"
              centerLat={task.latitude}
              centerLng={task.longitude}
              zoom={14}
            />
          </div>
        </div>

        {/* Right 1 Col: Citizen Info & Execution Form */}
        <div className="space-y-6">
          {/* Citizen Info Panel */}
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Citizen Contact Information
            </h3>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-slate-200">{citizen?.name || 'Citizen'}</span>
              </div>
              {citizen?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <a
                    href={`tel:${citizen.phone}`}
                    className="font-semibold text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {citizen.phone}
                  </a>
                </div>
              )}
              {citizen?.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-300 truncate max-w-[170px]">{citizen.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Collection Execution Form */}
          <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Camera className="w-4 h-4 text-purple-400" />
              Collection Proof & Documentation
            </h3>

            <ImageUploadField
              label="Collection Proof Photo (Required)"
              value={proofImageUrl}
              onChange={(url) => setProofImageUrl(url)}
              presets={SAMPLE_PROOF_PHOTOS}
              accentColor="sky"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Collector Field Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes regarding actual collected volume, condition, or site updates..."
                className="w-full glass-input text-xs"
              />
            </div>

            {/* Workflow Action Buttons */}
            <div className="pt-2 space-y-2">
              {task.status === 'ASSIGNED' && (
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>Start Collection (IN_PROGRESS)</span>
                </button>
              )}

              {task.status === 'IN_PROGRESS' && (
                <button
                  onClick={handleMarkCollected}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Mark Collected (Requires Proof Photo)</span>
                </button>
              )}

              {task.status === 'COLLECTED' && (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Complete Task & Notify Citizen</span>
                </button>
              )}

              {task.status === 'COMPLETED' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Task Completed & Archived</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    default:
      return 'bg-slate-800 text-slate-400';
  }
}
