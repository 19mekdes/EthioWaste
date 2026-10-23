
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import {
  TrendingUp,
  Users,
  Trash2,
  Truck,
  Recycle,
  AlertCircle,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAnalyticsOverview();
        setAnalytics(data);
      } catch (err: any) {
        setError(
          err.response?.data?.error ||
          'Failed to load municipal analytics metrics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const recycledKg = analytics?.totalRecycledKg || 0;
  const totalReports = analytics?.totalReports || 0;
  const totalRequests = analytics?.totalRequests || 0;

  return (
    <AdminLayout title="Municipal Environmental Analytics">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page heading */}
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Addis Ababa City Waste Management Metrics
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            High-level environmental impact and operational metrics.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center rounded-2xl border border-slate-100 bg-white py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Trash2 className="h-6 w-6" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Citizen Waste Reports
                </span>
                <span className="mt-1 block text-3xl font-black text-slate-800">
                  {analytics?.totalReports || 0}
                </span>
                <span className="mt-2 inline-block text-xs font-semibold text-emerald-700">
                  100% System Tracked
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck className="h-6 w-6" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Doorstep Pickups
                </span>
                <span className="mt-1 block text-3xl font-black text-slate-800">
                  {analytics?.totalRequests || 0}
                </span>
                <span className="mt-2 inline-block text-xs font-semibold text-blue-700">
                  Collector Dispatched
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Recycle className="h-6 w-6" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recycled Tonnage
                </span>
                <span className="mt-1 block text-3xl font-black text-slate-800">
                  {(recycledKg / 1000).toFixed(2)}{' '}
                  <span className="text-sm font-medium text-slate-500">
                    tons
                  </span>
                </span>
                <span className="mt-2 inline-block text-xs font-semibold text-purple-700">
                  ({recycledKg.toLocaleString()} kg total)
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Users className="h-6 w-6" />
                </div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Registered Platform Users
                </span>
                <span className="mt-1 block text-3xl font-black text-slate-800">
                  {analytics?.totalUsers || 0}
                </span>
                <span className="mt-2 inline-block text-xs font-semibold text-emerald-700">
                  Active Ecosystem
                </span>
              </div>
            </div>

            {/* Environmental impact summary */}
            <div className="space-y-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Sustainability Impact Assessment
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-3 rounded-2xl border border-slate-100 bg-[#F8FAF8] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    CO2 Emissions Saved
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    {((recycledKg * 1.5) / 1000).toFixed(2)} Metric Tons
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Estimated based on recycled plastic and metal diversion
                    from landfills.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100 bg-[#F8FAF8] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    Landfill Diverted Space
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    {(recycledKg * 2.2).toFixed(0)} m³
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Conserved landfill volume in Repi and Addis Ababa dump
                    sites.
                  </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-100 bg-[#F8FAF8] p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Community Eco-Points Distributed
                  </span>
                  <div className="text-2xl font-black text-slate-800">
                    {(totalReports * 15 + totalRequests * 25).toLocaleString()}{' '}
                    pts
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Total Eco-Points awarded to citizens for active
                    participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
