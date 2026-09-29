'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { updateReportStatus } from '@/actions/reports';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

interface PostCleanupModalProps {
  reportId: string;
  reportTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}

const sampleProofs = [
  { label: 'Cleaned Sidewalk', url: 'https://images.unsplash.com/photo-1611284446314-60a55ac7deab?w=800&auto=format&fit=crop&q=80' },
  { label: 'Emptied Bin', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cleared E-Waste', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
];

export function PostCleanupModal({ reportId, reportTitle, onSuccess, onClose }: PostCleanupModalProps) {
  const [cleanupImageUrl, setCleanupImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanupImageUrl) {
      setError('Please attach a post-cleanup verification photo');
      return;
    }

    setLoading(true);
    setError('');

    const res = await updateReportStatus(reportId, 'RESOLVED', cleanupImageUrl);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to update report status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-6 max-w-lg w-full border-sky-500/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
            📷
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Post-Cleanup Verification</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{reportTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <ImageUploadField
            label="Upload Cleanup Verification Photo"
            value={cleanupImageUrl}
            onChange={setCleanupImageUrl}
            presets={sampleProofs}
            accentColor="sky"
            previewHeight="h-44"
          />

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="glass-button-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="glass-button-primary text-xs">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Verify & Resolve Task (+50 PTS to Citizen)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
