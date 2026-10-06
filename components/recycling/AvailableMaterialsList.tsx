'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Boxes,
  Truck,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Loader2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { receiveAndCreateRecyclingRecord } from '@/actions/recycling';

interface AvailableMaterialsListProps {
  tasks: any[];
}

export function AvailableMaterialsList({ tasks: initialTasks }: AvailableMaterialsListProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [receivingId, setReceivingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReceiveTask = async (taskId: string) => {
    setReceivingId(taskId);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await receiveAndCreateRecyclingRecord(taskId);
    setReceivingId(null);

    if (res.success) {
      setSuccessMsg('Waste batch received successfully into recycling inventory!');
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      router.refresh();
    } else {
      setErrorMsg(res.error || 'Failed to receive material.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-400" />
            Available Recyclable Materials Queue
          </h1>
          <p className="text-xs text-slate-400">
            Collected waste batches from field operations ready to be accepted into facility inventory for recycling.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold">
          <Truck className="w-4 h-4" />
          <span>Available Batches: {tasks.length}</span>
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

      {/* Materials List */}
      {tasks.length === 0 ? (
        <div className="glass-card p-12 text-center border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Pending Batches Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All completed field collection tasks have been received into recycling inventory. Check back when new field pickups are completed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((t) => {
            const req = t.request;
            const rep = t.report;
            const wasteType = req?.wasteType || rep?.category || 'MIXED';
            const citizen = req?.citizen || rep?.reporter;
            const isReceiving = receivingId === t.id;

            return (
              <div
                key={t.id}
                className="glass-card p-5 border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{wasteType} Waste Batch</h3>
                        <span className="text-xs text-slate-400 font-mono">Task #{t.id.slice(-8)}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Citizen Source: <span className="font-semibold text-slate-200">{citizen?.name || 'Municipal Collection'}</span> ({citizen?.phone || citizen?.email || 'N/A'})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReceiveTask(t.id)}
                    disabled={isReceiving}
                    className="glass-button-primary py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    {isReceiving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PlusCircle className="w-4 h-4" />
                    )}
                    <span>Receive into Recycling</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{t.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Collected Date: {t.completedAt ? new Date(t.completedAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Collector Proof: {t.proofImageUrl ? 'Attached ✓' : 'N/A'}</span>
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
