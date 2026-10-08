import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import { Truck, CheckCircle2, Clock, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

export const CollectorOverviewPage: React.FC = () => {
  const [assignedTasks, setAssignedTasks] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await collectorService.getAssignedTasks();
        setAssignedTasks(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load collector dispatch tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const pendingOrProgressTasks = assignedTasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
  const completedTasks = assignedTasks.filter(t => t.status === 'COMPLETED');

  const mapMarkers = pendingOrProgressTasks.map(t => ({
    id: t.id,
    latitude: t.latitude,
    longitude: t.longitude,
    title: `${t.wasteType} Pickup (${t.status})`,
    description: t.address,
  }));

  return (
    <CollectorLayout title="Collector Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Tasks</span>
              <span className="text-3xl font-extrabold text-white">{pendingOrProgressTasks.length}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Completed</span>
              <span className="text-3xl font-extrabold text-white">{completedTasks.length}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Dispatched</span>
              <span className="text-3xl font-extrabold text-white">{assignedTasks.length}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pickup Route Map */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> Dispatch Route Overview (Addis Ababa)
            </h2>
            <span className="text-xs text-slate-400">{pendingOrProgressTasks.length} Active Stop(s)</span>
          </div>
          <InteractiveMap
            height="340px"
            latitude={8.9806}
            longitude={38.7578}
            zoom={12}
            markers={mapMarkers}
          />
        </div>

        {/* Assigned Pickups List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Collection Tasks</h2>
            <Link
              to="/collector/tasks"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All Tasks <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : pendingOrProgressTasks.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No pending active collection tasks assigned.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingOrProgressTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl p-6 shadow-lg space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase">
                        {task.wasteType}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        Qty: {task.estimatedQuantity}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {task.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {task.address}
                  </p>

                  <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Date: {new Date(task.preferredDate).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/collector/tasks/${task.id}`}
                      className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      Manage Pickup
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CollectorLayout>
  );
};
