import React, { useEffect, useState } from 'react';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import { CheckCircle2, Calendar, MapPin, Package, AlertCircle } from 'lucide-react';

export const CollectorHistoryPage: React.FC = () => {
  const [completedTasks, setCompletedTasks] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await collectorService.getAssignedTasks();
        const completed = data.filter(t => t.status === 'COMPLETED');
        setCompletedTasks(completed);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load completed collection history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <CollectorLayout title="Collection History Log">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Completed Collections Log</h2>
            <p className="text-sm text-slate-400">Historical archive of resolved waste pickup dispatches.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            Total Completed: {completedTasks.length}
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : completedTasks.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No completed collection history logged yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase">
                    {task.wasteType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  Qty Collected: {task.estimatedQuantity}
                </h3>

                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {task.address}
                </p>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Picked up on {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-slate-500">ID: #{task.id.substring(0, 8)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CollectorLayout>
  );
};
