import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import { ArrowLeft, Scale, Calendar, Building2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export const RecyclingRecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<RecyclingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recyclingService.getRecordById(id);
        setRecord(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load record details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <RecyclingLayout title="Record Audit">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      </RecyclingLayout>
    );
  }

  if (error || !record) {
    return (
      <RecyclingLayout title="Record Audit">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error || 'Record not found.'}</span>
          </div>
          <button
            onClick={() => navigate('/recycling/records')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Records
          </button>
        </div>
      </RecyclingLayout>
    );
  }

  return (
    <RecyclingLayout title={`Audit Record #${record.id.substring(0, 8)}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/recycling/records')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Intake Records
        </button>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Digital Audit Certificate
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                {record.materialType} Category Intake
              </h1>
            </div>
            <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Verified Log
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-purple-400" /> Recorded Weight
              </span>
              <p className="text-2xl font-black text-white">{record.quantityKg} kg</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" /> Source / Fleet Supplier
              </span>
              <p className="text-lg font-bold text-white">{record.source || 'N/A'}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400" /> Intake Timestamp
              </span>
              <p className="font-semibold text-white">{new Date(record.createdAt).toLocaleString()}</p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" /> Audit Hash Reference
              </span>
              <p className="font-mono text-xs text-slate-300 truncate">{record.id}</p>
            </div>
          </div>

          {record.notes && (
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 text-xs block mb-1">Batch Notes</span>
              <p className="text-slate-200 text-sm">{record.notes}</p>
            </div>
          )}
        </div>
      </div>
    </RecyclingLayout>
  );
};
