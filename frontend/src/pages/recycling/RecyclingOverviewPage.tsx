
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RecyclingLayout } from '../../layouts/RecyclingLayout';
import { recyclingService } from '../../services/recyclingService';
import { RecyclingRecord } from '../../types';
import {
  Building2,
  Scale,
  Recycle,
  Plus,
  ArrowRight,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const RecyclingOverviewPage: React.FC = () => {
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await recyclingService.getMyRecords();
        setRecords(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Failed to load recycling records.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const totalWeightKg = records.reduce(
    (acc, r) => acc + (r.quantityKg ?? r.quantity ?? 0),
    0
  );

  const plasticKg = records
    .filter((r) => (r.materialType || r.material) === 'PLASTIC')
    .reduce((acc, r) => acc + (r.quantityKg ?? r.quantity ?? 0), 0);

  const glassKg = records
    .filter((r) => (r.materialType || r.material) === 'GLASS')
    .reduce((acc, r) => acc + (r.quantityKg ?? r.quantity ?? 0), 0);

  const metalKg = records
    .filter((r) => (r.materialType || r.material) === 'METAL')
    .reduce((acc, r) => acc + (r.quantityKg ?? r.quantity ?? 0), 0);

  const metrics = [
    {
      label: 'Total Processed',
      value: totalWeightKg,
      icon: Scale,
    },
    {
      label: 'Plastic Weight',
      value: plasticKg,
      icon: Recycle,
    },
    {
      label: 'Glass Weight',
      value: glassKg,
      icon: TrendingUp,
    },
    {
      label: 'Metal Scrap',
      value: metalKg,
      icon: Building2,
    },
  ];

  return (
    <RecyclingLayout title="Facility Dashboard">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Recycling statistics */}
        <section
          aria-label="Recycling statistics"
          className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-start gap-4 border-b border-slate-200 py-4 sm:border-b-0 sm:border-l-2 sm:border-l-emerald-200 sm:pl-4"
            >
              <div className="shrink-0 rounded-lg bg-emerald-50 p-3 text-emerald-700">
                <metric.icon className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 break-words text-2xl font-bold text-slate-800">
                  {metric.value.toLocaleString()} kg
                </p>
              </div>
            </div>
          ))}
        </section>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Recent shipments heading */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Material Intake &amp; Processing
            </h2>

            <Link
              to="/recycling/records"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <Plus className="h-4 w-4" />
              Log New Shipment
            </Link>
          </div>

          {/* Shipment records */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
            </div>
          ) : records.length === 0 ? (
            <div className="py-10 text-sm text-slate-500">
              No recycling shipment records registered yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {records.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {r.materialType || r.material}
                      </span>

                      <span className="text-base font-semibold text-slate-800">
                        {(r.quantityKg ?? r.quantity ?? 0).toLocaleString()} kg
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      Source: {r.source || 'Municipal Dispatch'}{' '}
                      <span className="mx-1 text-slate-300">|</span>
                      Processed on{' '}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Link
                    to={`/recycling/records/${r.id}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </RecyclingLayout>
  );
};
