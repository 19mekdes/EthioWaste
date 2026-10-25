
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { adminService } from '../../services/adminService';
import { reportService } from '../../services/reportService';
import { WasteReport } from '../../types';
import {
  Users,
  Trash2,
  Truck,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

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
        setError(
          err.response?.data?.error ||
            'Failed to load municipal dashboard overview.'
        );
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Waste Reports
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {analytics?.totalReports || 0}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Collection Pickups
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {analytics?.totalRequests || 0}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-purple-50 text-purple-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Recycled Kg
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {(analytics?.totalRecycledKg || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Users
              </span>
              <span className="text-3xl font-bold text-slate-800">
                {analytics?.totalUsers || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* City Map */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Addis Ababa Incident &amp; Pickup Map
            </h2>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
            >
              Manage All Reports
              <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Citizen Waste Reports
            </h2>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
            >
              View All ({analytics?.totalReports || 0})
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
          ) : recentReports.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
              No recent waste reports submitted.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4">Type</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Severity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {recentReports.map((rep) => (
                      <tr
                        key={rep.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-slate-800">
                          {rep.wasteType}
                        </td>
                        <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                          {rep.address}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {rep.severity || 'MEDIUM'}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {rep.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link
                            to="/admin/reports"
                            className="inline-flex px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
