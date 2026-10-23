
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import {
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  AlertCircle,
} from 'lucide-react';

export const CollectorTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ACTIVE');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collectorService.getAssignedTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch assigned tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await collectorService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update task status.'
      );
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ACTIVE') {
      return t.status !== 'COMPLETED' && t.status !== 'CANCELLED';
    }
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <CollectorLayout title="Assigned Collection Tasks">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Collector Dispatch List
            </h2>
            <p className="text-sm text-slate-500">
              View and update collection progress for assigned routes.
            </p>
          </div>

          <div className="flex w-full items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 sm:w-auto sm:gap-2">
            {['ACTIVE', 'COMPLETED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition sm:flex-none sm:px-4 ${filter === st
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-12 text-center text-slate-500 shadow-sm">
            No collection tasks found in this section.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col items-start justify-between gap-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-colors hover:border-emerald-100 md:flex-row md:items-center"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      {(task as any).wasteType ||
                        (task as any).request?.wasteType ||
                        (task as any).report?.category ||
                        'General Waste'}
                    </span>

                    <span className="text-xs font-semibold text-slate-500">
                      Qty:{' '}
                      {(task as any).estimatedQuantity ||
                        (task as any).request?.estimatedQuantity ||
                        'Standard Load'}
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      Status: {task.status}
                    </span>
                  </div>

                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-700" />
                    <span className="break-words">{task.address}</span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-emerald-700" />
                      Date:{' '}
                      {new Date(
                        (task as any).scheduledDate ||
                        (task as any).preferredDate ||
                        (task as any).createdAt
                      ).toLocaleDateString()}
                    </span>

                    {task.preferredTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-emerald-700" />
                        Time: {task.preferredTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4 sm:gap-3 md:w-auto md:border-t-0 md:pt-0">
                  {(task.status === 'ASSIGNED' ||
                    task.status === 'SCHEDULED') && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(task.id, 'IN_PROGRESS')
                        }
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:flex-none sm:py-2.5"
                      >
                        <Play className="h-4 w-4" />
                        Start Route
                      </button>
                    )}

                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(task.id, 'COMPLETED')
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:flex-none sm:py-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Complete
                    </button>
                  )}

                  <Link
                    to={`/collector/tasks/${task.id}`}
                    className="flex-1 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-center text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:flex-none sm:py-2.5"
                  >
                    Details &amp; Map
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CollectorLayout>
  );
};
