import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { WasteReport } from '../../types';
import { Users, Trash2, Truck, Building2, MapPin, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const [anData, repData] = await Promise.all([
          adminService.getAnalyticsOverview(),
          reportService.getAllReports(),
        ]);
        setAnalytics(anData);
        setRecentReports(repData.slice(0, 5));
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load municipal dashboard overview.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const reportMarkers = recentReports.map((r) => ({
    id: r.id,
    latitude: r.latitude,
    longitude: r.longitude,
    title: `${r.wasteType} Report (${r.status})`,
    description: r.address,
  }));

  return (
    <AdminLayout title="Municipal Administration Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
              <Trash2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Waste Reports</span>
              <span className="text-3xl font-black text-white">{analytics?.totalReports || 0}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Collection Pickups</span>
              <span className="text-3xl font-black text-white">{analytics?.totalRequests || 0}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Recycle Kg</span>
              <span className="text-3xl font-black text-white">{(analytics?.totalRecycledKg || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Users</span>
              <span className="text-3xl font-black text-white">{analytics?.totalUsers || 0}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* City Map */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" /> Addis Ababa Incident & Pickup Map
            </h2>
            <Link to="/admin/reports" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              Manage All Reports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <InteractiveMap
            height="340px"
            latitude={8.9806}
            longitude={38.7578}
            zoom={12}
            markers={reportMarkers}
          />
        </div>

        {/* Recent Incident Reports Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Citizen Waste Reports</h2>
            <Link to="/admin/reports" className="text-xs font-semibold text-amber-400 hover:text-amber-300">
              View All ({analytics?.totalReports || 0})
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : recentReports.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No recent waste reports submitted.
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="p-4">Type</th>
                    <th className="p-4">Address</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
                  {recentReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-4 font-bold text-white">{rep.wasteType}</td>
                      <td className="p-4 text-xs text-slate-300 max-w-xs truncate">{rep.address}</td>
                      <td className="p-4 text-xs font-bold text-amber-400">{rep.severity || 'MEDIUM'}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          to="/admin/reports"
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold transition"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
