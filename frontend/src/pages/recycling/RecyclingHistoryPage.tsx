import React, { useEffect, useState } from 'react';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import { Scale, Calendar, AlertCircle } from 'lucide-react';

export const RecyclingHistoryPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recyclingService.getMyRecords();
        setRecords(Array.isArray(data) ? data : (data as any)?.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load historical audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <RecyclingLayout title="Facility Processing History">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Recycling Processing History</h2>
            <p className="text-sm text-slate-400">Historical archive of logged intake batches.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-bold">
            Total Batches: {records.length}
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No processing history logged yet.
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Material Type</th>
                  <th className="p-4">Weight (kg)</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {r.materialType || r.material || 'GENERAL'}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-white">{(r.quantityKg || r.quantity || 0).toLocaleString()} kg</td>
                    <td className="p-4 text-slate-400">{r.source || 'N/A'}</td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RecyclingLayout>
  );
};
