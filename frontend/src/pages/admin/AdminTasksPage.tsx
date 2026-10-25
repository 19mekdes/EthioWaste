
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { CollectionRequest } from '../../types';
import { AlertCircle } from 'lucide-react';

export const AdminTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllRequests();
        setTasks(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dispatch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <AdminLayout title="Dispatch Fleet Overview">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Active Collection Fleet &amp; Dispatch Log
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Monitor en-route pickup trucks and completed dispatches.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-12">
            No active dispatch tasks in system.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="p-4 font-semibold">Waste Type</th>
                    <th scope="col" className="p-4 font-semibold">Address</th>
                    <th scope="col" className="p-4 font-semibold">Assigned Collector</th>
                    <th scope="col" className="p-4 font-semibold">Status</th>
                    <th scope="col" className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {tasks.map((t) => (
                    <tr key={t.id} className="transition hover:bg-emerald-50/40">
                      <td className="p-4 font-semibold text-slate-800">{t.wasteType}</td>
                      <td className="max-w-xs truncate p-4 text-xs text-slate-600">{t.address}</td>
                      <td className="p-4 text-xs font-semibold text-emerald-700">
                        {t.assignedCollector?.name || 'Unassigned'}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(t.preferredDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
