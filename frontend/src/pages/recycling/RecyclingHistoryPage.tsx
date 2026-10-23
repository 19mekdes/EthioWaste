
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
        setRecords(
          Array.isArray(data) ? data : (data as any)?.data || []
        );
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
          'Failed to load historical audit logs.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <RecyclingLayout title="Facility Processing History">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recycling Processing History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Historical archive of logged intake batches.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="rounded-lg bg-emerald-50 px-3 py-2 font-medium text-emerald-800">
              Total Batches: {records.length}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No processing history logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-4 font-semibold">Material Type</th>
                  <th className="px-4 py-4 font-semibold">Weight (kg)</th>
                  <th className="px-4 py-4 font-semibold">Source</th>
                  <th className="px-4 py-4 font-semibold">Logged Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {records.map((r) => (
                  <tr
                    key={r.id}
                    className="transition hover:bg-emerald-50/40"
                  >
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {r.materialType || r.material || 'GENERAL'}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">
                      {(r.quantityKg ?? r.quantity ?? 0).toLocaleString()} kg
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {r.source || 'N/A'}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-emerald-700" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
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
