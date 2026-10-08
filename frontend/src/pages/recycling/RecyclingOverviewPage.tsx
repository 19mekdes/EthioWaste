import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import { Building2, Scale, Recycle, Plus, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';

export const RecyclingOverviewPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recyclingService.getMyRecords();
        setRecords(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load recycling records.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const totalWeightKg = records.reduce((acc, r) => acc + (r.quantityKg || 0), 0);
  const plasticKg = records.filter(r => r.materialType === 'PLASTIC').reduce((acc, r) => acc + (r.quantityKg || 0), 0);
  const glassKg = records.filter(r => r.materialType === 'GLASS').reduce((acc, r) => acc + (r.quantityKg || 0), 0);
  const metalKg = records.filter(r => r.materialType === 'METAL').reduce((acc, r) => acc + (r.quantityKg || 0), 0);

  return (
    <RecyclingLayout title="Facility Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Processed</span>
              <span className="text-2xl font-black text-white">{totalWeightKg.toLocaleString()} kg</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
              <Recycle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Plastic Weight</span>
              <span className="text-2xl font-black text-white">{plasticKg.toLocaleString()} kg</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Glass Weight</span>
              <span className="text-2xl font-black text-white">{glassKg.toLocaleString()} kg</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Metal Scrap</span>
              <span className="text-2xl font-black text-white">{metalKg.toLocaleString()} kg</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Material Intake & Processing</h2>
          <Link
            to="/recycling/records"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Log New Shipment
          </Link>
        </div>

        {/* Processing Logs */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No recycling shipment records registered yet.
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 divide-y divide-slate-700/60 shadow-xl">
            {records.slice(0, 5).map((r) => (
              <div key={r.id} className="py-4 px-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {r.materialType}
                    </span>
                    <span className="font-bold text-white text-base">{r.quantityKg} kg</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Source: {r.source || 'Municipal Dispatch'} | Processed on {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/recycling/records/${r.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecyclingLayout>
  );
};
