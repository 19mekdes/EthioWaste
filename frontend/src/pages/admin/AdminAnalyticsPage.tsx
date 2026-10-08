import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { BarChart3, TrendingUp, Users, Trash2, Truck, Recycle, Award, AlertCircle } from 'lucide-react';

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
        setError(err.response?.data?.error || 'Failed to load municipal analytics metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <AdminLayout title="Municipal Environmental Analytics">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Addis Ababa City Waste Management Metrics</h2>
          <p className="text-sm text-slate-400">High-level environmental impact and operational metrics.</p>
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
        ) : (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-3">
                  <Trash2 className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Citizen Waste Reports</span>
                <span className="text-3xl font-black text-white mt-1 block">{analytics?.totalReports || 0}</span>
                <span className="text-xs text-emerald-400 font-semibold mt-2 inline-block">100% System Tracked</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Doorstep Pickups</span>
                <span className="text-3xl font-black text-white mt-1 block">{analytics?.totalRequests || 0}</span>
                <span className="text-xs text-blue-400 font-semibold mt-2 inline-block">Collector Dispatched</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-3">
                  <Recycle className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Recycled Tonnage</span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {((analytics?.totalRecycledKg || 0) / 1000).toFixed(2)} <span className="text-sm font-medium text-slate-400">tons</span>
                </span>
                <span className="text-xs text-purple-400 font-semibold mt-2 inline-block">
                  ({(analytics?.totalRecycledKg || 0).toLocaleString()} kg total)
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Registered Platform Users</span>
                <span className="text-3xl font-black text-white mt-1 block">{analytics?.totalUsers || 0}</span>
                <span className="text-xs text-emerald-400 font-semibold mt-2 inline-block">Active Ecosystem</span>
              </div>
            </div>

            {/* Environmental Impact Summary */}
            <div className="bg-gradient-to-r from-slate-800/90 to-slate-900 border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Sustainability Impact Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CO2 Emissions Saved</span>
                  <div className="text-2xl font-black text-white">
                    {(((analytics?.totalRecycledKg || 0) * 1.5) / 1000).toFixed(2)} Metric Tons
                  </div>
                  <p className="text-xs text-slate-400">Estimated based on recycled plastic and metal diversion from landfills.</p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Landfill Diverted Space</span>
                  <div className="text-2xl font-black text-white">
                    {(((analytics?.totalRecycledKg || 0) * 2.2)).toFixed(0)} m³
                  </div>
                  <p className="text-xs text-slate-400">Conserved landfill volume in Repi & Addis Ababa dump sites.</p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Community Eco-Points Distributed</span>
                  <div className="text-2xl font-black text-white">
                    {((analytics?.totalReports || 0) * 15 + (analytics?.totalRequests || 0) * 25).toLocaleString()} pts
                  </div>
                  <p className="text-xs text-slate-400">Total Eco-Points awarded to citizens for active participation.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
