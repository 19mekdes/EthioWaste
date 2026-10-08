import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { reportService } from '../../services/reportService';
import { adminService } from '../../services/adminService';
import { collectorService } from '../../services/collectorService';
import { WasteReport, User } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { Trash2, MapPin, CheckCircle2, Clock, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [collectors, setCollectors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Selected report for modal or action
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [assignedCollectorId, setAssignedCollectorId] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [repData, collData] = await Promise.all([
        reportService.getAllReports(),
        adminService.getCollectors(),
      ]);
      setReports(repData);
      setCollectors(collData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch waste reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      setUpdating(true);
      await adminService.updateReportStatus(reportId, newStatus, assignedCollectorId || undefined);
      setSelectedReport(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update report status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredReports = filterStatus === 'ALL'
    ? reports
    : reports.filter((r) => r.status === filterStatus);

  return (
    <AdminLayout title="Waste Incident Verification & Reports">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Citizen Illegal Dumping Reports</h2>
            <p className="text-sm text-slate-400">Review reported waste sites, verify status, and award Eco-Points.</p>
          </div>

          <div className="flex flex-wrap gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {['ALL', 'REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === st
                    ? 'bg-amber-500 text-slate-950 shadow'
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No waste reports matching this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      {report.wasteType}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {report.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {report.title || `${report.wasteType} Waste Site`}
                  </h3>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {report.address}
                  </p>

                  <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 mb-3">
                    "{report.description}"
                  </p>

                  {report.photos && report.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {report.photos.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Report photo"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Points: +{report.pointsAwarded || 10}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setAssignedCollectorId(report.assignedCollectorId || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    Action / Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Managing Report */}
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-xl font-bold text-white">Review Waste Report #{selectedReport.id.substring(0, 8)}</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-400 font-bold">{selectedReport.wasteType}</span>
                  <span className="text-slate-300">Status: {selectedReport.status}</span>
                </div>

                <p className="text-slate-300 text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
                  {selectedReport.description}
                </p>

                {/* Map */}
                <InteractiveMap
                  height="220px"
                  latitude={selectedReport.latitude}
                  longitude={selectedReport.longitude}
                  markers={[
                    {
                      id: selectedReport.id,
                      latitude: selectedReport.latitude,
                      longitude: selectedReport.longitude,
                      title: selectedReport.wasteType,
                      description: selectedReport.address,
                    }
                  ]}
                />

                {/* Assign Collector Optional */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Assign Municipal Collector (Optional Dispatch)
                  </label>
                  <select
                    value={assignedCollectorId}
                    onChange={(e) => setAssignedCollectorId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="">-- Select Collector Fleet --</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.subCity || 'Addis Ababa'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'VERIFIED')}
                    disabled={updating}
                    className="py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs"
                  >
                    Verify Report
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'IN_PROGRESS')}
                    disabled={updating}
                    className="py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs"
                  >
                    Dispatch / Progress
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                    disabled={updating}
                    className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'REJECTED')}
                    disabled={updating}
                    className="py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs"
                  >
                    Reject Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
