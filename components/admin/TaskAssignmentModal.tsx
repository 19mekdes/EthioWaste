'use client';

import React, { useState } from 'react';
import { UserCheck, Truck, Loader2, X, CheckCircle2 } from 'lucide-react';
import { assignReportToCollector } from '@/actions/reports';

interface CollectorOption {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  _count?: { assignedTasks: number };
}

interface TaskAssignmentModalProps {
  reportId: string;
  reportTitle: string;
  collectors: CollectorOption[];
  onSuccess: () => void;
  onClose: () => void;
}

export function TaskAssignmentModal({
  reportId,
  reportTitle,
  collectors,
  onSuccess,
  onClose,
}: TaskAssignmentModalProps) {
  const [selectedCollectorId, setSelectedCollectorId] = useState(collectors[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollectorId) {
      setError('Please select a field collector');
      return;
    }

    setLoading(true);
    setError('');

    const res = await assignReportToCollector(reportId, selectedCollectorId);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to assign collector');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-md w-full border-amber-500/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            🛡️
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Assign Field Collector</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{reportTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Field Collector</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {collectors.map((col) => (
                <div
                  key={col.id}
                  onClick={() => setSelectedCollectorId(col.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedCollectorId === col.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={col.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'}
                      alt={col.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100">{col.name}</div>
                      <div className="text-[10px] text-slate-400">{col.email}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {col._count?.assignedTasks || 0} active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="glass-button-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="glass-button-primary text-xs bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-900" /> : <Truck className="w-4 h-4" />}
              <span>Confirm Task Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
