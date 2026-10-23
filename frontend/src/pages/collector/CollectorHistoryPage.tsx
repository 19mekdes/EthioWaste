import React, { useEffect, useState } from 'react';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  AlertCircle,
} from 'lucide-react';

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
        const completed = data.filter((t) => t.status === 'COMPLETED');
        setCompletedTasks(completed);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            'Failed to load completed collection history.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <CollectorLayout title="Collection History Log">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Heading and completed count */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Completed Collections Log
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Historical archive of resolved waste pickup dispatches.
            </p>
          </div>

          <span className="inline-flex items-center rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
            Total Completed: {completedTasks.length}
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading, empty, and history states */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : completedTasks.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-slate-500 shadow-sm">
            No completed collection history logged yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-colors hover:border-emerald-100"
              >
                {/* Waste type and status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                    {task.wasteType}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                </div>

                {/* Quantity */}
                <h3 className="text-base font-bold text-slate-800">
                  Qty Collected: {task.estimatedQuantity}
                </h3>

                {/* Address */}
                <p className="flex items-start gap-1.5 text-sm text-slate-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                  <span>{task.address}</span>
                </p>

                {/* Date and task ID */}
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-emerald-700" />
                    Picked up on{' '}
                    {new Date(
                      task.updatedAt || task.createdAt
                    ).toLocaleDateString()}
                  </span>

                  <span className="text-slate-400">
                    ID: #{task.id.substring(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CollectorLayout>
  );
};