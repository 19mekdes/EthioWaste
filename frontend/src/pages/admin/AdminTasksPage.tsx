import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { CollectionRequest } from '../../types';
import { Truck, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

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
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Active Collection Fleet & Dispatch Log</h2>
          <p className="text-sm text-slate-400">Monitor en-route pickup trucks and completed dispatches.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No active dispatch tasks in system.
          </div>
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4">Waste Type</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Assigned Collector</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 font-bold text-white">{t.wasteType}</td>
                    <td className="p-4 text-xs text-slate-300 max-w-xs truncate">{t.address}</td>
                    <td className="p-4 text-xs font-semibold text-blue-400">
                      {t.assignedCollector?.name || 'Unassigned'}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-emerald-400 border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(t.preferredDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
