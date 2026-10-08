import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import { Truck, MapPin, Calendar, CheckCircle2, Clock, Play, AlertCircle } from 'lucide-react';

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
      alert(err.response?.data?.error || 'Failed to update task status.');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ACTIVE') return t.status !== 'COMPLETED' && t.status !== 'CANCELLED';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <CollectorLayout title="Assigned Collection Tasks">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Collector Dispatch List</h2>
            <p className="text-sm text-slate-400">View and update collection progress for assigned routes.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            {['ACTIVE', 'COMPLETED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  filter === st
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
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
        ) : filteredTasks.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No collection tasks found in this section.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {task.wasteType}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Qty: {task.estimatedQuantity}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      Status: {task.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {task.address}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" /> Date: {new Date(task.preferredDate).toLocaleDateString()}
                    </span>
                    {task.preferredTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time: {task.preferredTime}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-700">
                  {(task.status === 'ASSIGNED' || task.status === 'SCHEDULED') && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                      className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4" /> Start Route
                    </button>
                  )}

                  {task.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Complete
                    </button>
                  )}

                  <Link
                    to={`/collector/tasks/${task.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold text-xs transition"
                  >
                    Details & Map
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
