'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Recycle,
  Boxes,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Play,
  FileText,
  Loader2,
  AlertCircle,
  Package,
  Tag,
  ImageIcon,
} from 'lucide-react';
import {
  acceptRecyclingRecord,
  startRecyclingProcess,
  completeRecycling,
} from '@/actions/recycling';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';

interface RecyclingRecordDetailProps {
  record: any;
}

export function RecyclingRecordDetail({ record }: RecyclingRecordDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Execution form states
  const [recycledQuantity, setRecycledQuantity] = useState<number>(record.quantity || 25);
  const [notes, setNotes] = useState(record.notes || '');

  const task = record.collectionTask;
  const citizen = task?.request?.citizen || task?.report?.reporter;
  const address = task?.address || 'Metropolitan Collection Route';

  const mapMarkers: MapMarker[] = task
    ? [
        {
          id: task.id,
          title: `${record.material} Source`,
          description: task.address || 'Pickup origin',
          category: record.material,
          severity: 'MEDIUM',
          status: record.status,
          latitude: task.latitude,
          longitude: task.longitude,
          address: task.address || undefined,
          type: 'PICKUP',
        },
      ]
    : [];

  const handleAccept = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await acceptRecyclingRecord(record.id);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Material formally ACCEPTED into inventory!');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to accept material.');
    }
  };

  const handleStartProcessing = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await startRecyclingProcess(record.id);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Recycling process STARTED! Status updated to PROCESSING.');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to start processing.');
    }
  };

  const handleComplete = async () => {
    if (!recycledQuantity || recycledQuantity <= 0) {
      setErrorMsg('Please enter a valid recycled quantity greater than 0.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await completeRecycling(record.id, recycledQuantity, notes);
    setLoading(false);

    if (res.success) {
      setSuccessMsg('Recycling successfully COMPLETED! Material transformed into reusable output.');
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to complete recycling.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/recycling/records"
          className="glass-button-secondary text-xs py-2 px-3 flex items-center gap-1 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Records</span>
        </Link>
        <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold ${getRecyclingStatusBadge(record.status)}`}>
          {record.status}
        </span>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Recycle className="w-6 h-6 text-emerald-400" />
              {record.material} Processing Record
            </h1>
            <span className="text-xs text-slate-400 font-mono">#{record.id.slice(-8)}</span>
          </div>
          <p className="text-xs text-slate-400">
            Facility material transformation & inventory processing record for {record.organization?.name}.
          </p>
        </div>

        {/* Action Button for Header */}
        <div>
          {record.status === 'PENDING' && (
            <button
              onClick={handleAccept}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Accept Material</span>
            </button>
          )}

          {record.status === 'ACCEPTED' && (
            <button
              onClick={handleStartProcessing}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Start Processing</span>
            </button>
          )}

          {record.status === 'PROCESSING' && (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="glass-button-primary py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Complete Recycling</span>
            </button>
          )}

          {record.status === 'RECYCLED' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Material Successfully Recycled</span>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Material Info & Origin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Information Card */}
          <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              Material Batch & Processing Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Material Category</span>
                <span className="font-bold text-slate-100 bg-slate-800/60 px-2.5 py-1 rounded-md inline-block">
                  {record.material}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Batch Quantity</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-block">
                  {record.quantity} {record.unit}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Received / Created Date</span>
                <span className="font-semibold text-slate-200 mt-1 block">
                  {new Date(record.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Plant Processing Date</span>
                <span className="font-semibold text-purple-300 mt-1 block">
                  {record.processedAt ? new Date(record.processedAt).toLocaleString() : 'Pending Processing'}
                </span>
              </div>
            </div>

            {/* Field Notes & Instructions */}
            {record.notes && (
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-slate-400 block text-xs mb-1 font-semibold">Facility & Field Notes:</span>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {record.notes}
                </p>
              </div>
            )}
          </div>

          {/* Collection Proof & Source Location */}
          {task && (
            <div className="glass-card p-6 border-slate-800 bg-slate-900/40 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                Source Pickup Origin & Collector Verification Photo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Source Address:</span>
                  <p className="text-slate-200 font-semibold">{task.address}</p>
                </div>

                {task.proofImageUrl && (
                  <div>
                    <span className="text-slate-400 block mb-1 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                      Collector Proof Photo:
                    </span>
                    <div className="h-32 rounded-xl overflow-hidden border border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={task.proofImageUrl} alt="Collector proof" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              {mapMarkers.length > 0 && (
                <InteractiveMap
                  markers={mapMarkers}
                  height="300px"
                  centerLat={task.latitude}
                  centerLng={task.longitude}
                  zoom={13}
                />
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Citizen Info & Processing Actions */}
        <div className="space-y-6">
          {/* Citizen Info Panel */}
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              Source Citizen Information
            </h3>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-bold text-slate-200">{citizen?.name || 'Municipal Collection'}</span>
              </div>
              {citizen?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-emerald-400">{citizen.phone}</span>
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

          {/* Processing Control Action Form */}
          <div className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Recycle className="w-4 h-4 text-emerald-400" />
              Recycling Processing Actions
            </h3>

            {record.status === 'PROCESSING' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Final Recycled Quantity ({record.unit})
                  </label>
                  <span className="text-[10px] text-slate-400">Received Batch: {record.quantity} {record.unit}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={record.quantity}
                  value={recycledQuantity}
                  onChange={(e) => setRecycledQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full glass-input text-xs font-bold text-emerald-400"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be &gt; 0 and &le; {record.quantity} {record.unit}
                </span>
              </div>
            )}

            {(record.status === 'ACCEPTED' || record.status === 'PROCESSING') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Facility Notes / Processing Log
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter plant observations, sorting results, or output resource details..."
                  className="w-full glass-input text-xs"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              {record.status === 'PENDING' && (
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>1. Accept Material (ACCEPTED)</span>
                </button>
              )}

              {record.status === 'ACCEPTED' && (
                <button
                  onClick={handleStartProcessing}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>2. Start Plant Processing (PROCESSING)</span>
                </button>
              )}

              {record.status === 'PROCESSING' && (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full glass-button-primary py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>3. Complete Recycling (RECYCLED)</span>
                </button>
              )}

              {record.status === 'RECYCLED' && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Processing Finished & Output Recorded</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
