
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CollectorLayout } from '../../layouts/CollectorLayout';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { collectorService } from '../../services/collectorService';
import { CollectionRequest } from '../../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

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
        setError(
          err.response?.data?.error ||
          'Failed to load collector dispatch tasks.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const pendingOrProgressTasks = assignedTasks.filter(
    (t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED'
  );

  const completedTasks = assignedTasks.filter(
    (t) => t.status === 'COMPLETED'
  );

  const mapMarkers = pendingOrProgressTasks.map((t) => ({
    id: t.id,
    latitude: t.latitude,
    longitude: t.longitude,
    title: `${t.wasteType} Pickup (${t.status})`,
    description: t.address,
  }));

  return (
    <CollectorLayout title="Collector Dashboard">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Tasks
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {pendingOrProgressTasks.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Completed
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {completedTasks.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Dispatched
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {assignedTasks.length}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pickup Route Map */}
        <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <MapPin className="h-5 w-5 text-emerald-700" />
              Dispatch Route Overview (Addis Ababa)
            </h2>
            <span className="text-xs text-slate-500">
              {pendingOrProgressTasks.length} Active Stop(s)
            </span>
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800">
              Active Collection Tasks
            </h2>
            <Link
              to="/collector/tasks"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View All Tasks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
            </div>
          ) : pendingOrProgressTasks.length === 0 ? (
            <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">
              No pending active collection tasks assigned.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {pendingOrProgressTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="space-y-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-colors hover:border-emerald-200 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold uppercase text-emerald-700">
                        {task.wasteType}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-slate-800">
                        Qty: {task.estimatedQuantity}
                      </h3>
                    </div>
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {task.status}
                    </span>
                  </div>

                  <p className="flex items-center gap-1.5 truncate text-xs text-slate-600">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-700" />
                    {task.address}
                  </p>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-500">
                      Date:{' '}
                      {new Date(task.preferredDate).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/collector/tasks/${task.id}`}
                      className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
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
