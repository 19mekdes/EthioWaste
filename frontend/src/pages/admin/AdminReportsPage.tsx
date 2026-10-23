
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { reportService } from '../../services/reportService';
import { adminService } from '../../services/adminService';
import { WasteReport, User } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  MapPin,
  AlertCircle,
  X,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [collectors, setCollectors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
      await adminService.updateReportStatus(
        reportId,
        newStatus,
        assignedCollectorId || undefined
      );
      setSelectedReport(null);
      await fetchData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update report status.'
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredReports =
    filterStatus === 'ALL'
      ? reports
      : reports.filter((r) => r.status === filterStatus);

  const statusStyles: Record<string, string> = {
    REPORTED: 'bg-amber-50 text-amber-700 border-amber-200',
    VERIFIED: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-purple-50 text-purple-700 border-purple-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <AdminLayout title="Waste Incident Verification & Reports">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Citizen Illegal Dumping Reports
            </h2>
            <p className="text-sm text-slate-500">
              Review reported waste sites, verify status, and award Eco-Points.
            </p>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {['ALL', 'REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filterStatus === st
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-800'
                    }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No waste reports matching this status.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      {report.wasteType}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[report.status] ||
                        'border-slate-200 bg-slate-50 text-slate-600'
                        }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <h3 className="mb-2 text-base font-bold text-slate-800">
                    {report.title || `${report.wasteType} Waste Site`}
                  </h3>

                  <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                    {report.address}
                  </p>

                  <p className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
                    "{report.description}"
                  </p>

                  {report.photos && report.photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {report.photos.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Report photo"
                          className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-500">
                    Points: +{report.pointsAwarded || 10}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReport(report);
                      setAssignedCollectorId(report.assignedCollectorId || '');
                    }}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget && !updating) {
                setSelectedReport(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-modal-title"
              className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:space-y-6 sm:rounded-3xl sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
                <h3
                  id="report-modal-title"
                  className="truncate pr-2 text-lg font-bold text-slate-800 sm:text-xl"
                >
                  Review Report #{selectedReport.id.substring(0, 8)}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  disabled={updating}
                  aria-label="Close report review"
                  className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold text-emerald-700">
                    {selectedReport.wasteType}
                  </span>
                  <span className="text-slate-500">
                    Status: {selectedReport.status}
                  </span>
                </div>

                <p className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 sm:p-4 sm:text-sm">
                  {selectedReport.description}
                </p>

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
                    },
                  ]}
                />

                <div>
                  <label
                    htmlFor="assigned-collector"
                    className="mb-1 block text-xs font-semibold text-slate-700"
                  >
                    Assign Municipal Collector (Optional Dispatch)
                  </label>
                  <select
                    id="assigned-collector"
                    value={assignedCollectorId}
                    onChange={(e) => setAssignedCollectorId(e.target.value)}
                    disabled={updating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                  >
                    <option value="">-- Select Collector Fleet --</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.subCity || 'Addis Ababa'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'VERIFIED')}
                    disabled={updating}
                    className="truncate rounded-xl bg-blue-600 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                  >
                    Verify Report
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'IN_PROGRESS')}
                    disabled={updating}
                    className="truncate rounded-xl bg-purple-600 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                  >
                    Dispatch / Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                    disabled={updating}
                    className="truncate rounded-xl bg-emerald-700 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
                  >
                    Mark Resolved
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReport.id, 'REJECTED')}
                    disabled={updating}
                    className="truncate rounded-xl bg-rose-600 px-2 py-2.5 text-[11px] font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
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
