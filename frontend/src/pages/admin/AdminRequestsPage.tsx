
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { CollectionRequest, User } from '../../types';
import { MapPin, Calendar, AlertCircle, UserCheck, X } from 'lucide-react';

export const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [collectors, setCollectors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<CollectionRequest | null>(null);
  const [assignedCollectorId, setAssignedCollectorId] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reqData, collData] = await Promise.all([
        adminService.getAllRequests(),
        adminService.getCollectors(),
      ]);
      setRequests(reqData);
      setCollectors(collData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch collection requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignCollector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !assignedCollectorId) return;

    try {
      setUpdating(true);
      await adminService.assignCollectorToRequest(selectedRequest.id, assignedCollectorId);
      setSelectedRequest(null);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to dispatch collector.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Collection Request Dispatches">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doorstep Waste Collection Requests</h2>
          <p className="mt-1 text-sm text-slate-500">
            Dispatch registered municipal collectors to citizen pickup locations.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-12">
            No collection requests in system.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-emerald-700">
                      {req.wasteType}
                    </span>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {req.status}
                    </span>
                  </div>

                  <h3 className="mb-3 text-base font-bold text-slate-800">
                    Quantity: {req.estimatedQuantity}
                  </h3>

                  <p className="mb-3 flex items-start gap-1.5 text-xs text-slate-600">
                    <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{req.address}</span>
                  </p>

                  <p className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    {new Date(req.preferredDate).toLocaleDateString()}
                  </p>

                  {req.assignedCollector ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                      <span className="mb-1 block text-slate-500">Assigned Collector:</span>
                      <span className="font-semibold text-slate-800">
                        {req.assignedCollector.name}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                      Unassigned - Needs Collector
                    </div>
                  )}
                </div>

                <div className="flex justify-end border-t border-slate-100 pt-4">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setAssignedCollectorId(req.assignedCollectorId || '');
                    }}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    Dispatch / Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Assigning Collector */}
        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !updating) {
                setSelectedRequest(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="dispatch-modal-title"
              className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:space-y-6 sm:rounded-3xl sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 id="dispatch-modal-title" className="text-lg font-bold text-slate-800 sm:text-xl">
                  Dispatch Collector
                </h3>
                <button
                  type="button"
                  aria-label="Close dispatch dialog"
                  onClick={() => !updating && setSelectedRequest(null)}
                  disabled={updating}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAssignCollector} className="space-y-4">
                <div>
                  <span className="mb-1 block text-xs text-slate-500">Pickup Address</span>
                  <p className="text-sm font-semibold text-slate-800">
                    {selectedRequest.address}
                  </p>
                </div>

                <div>
                  <label htmlFor="collector-select" className="mb-1 block text-xs font-semibold text-slate-700">
                    Select Collector Fleet Unit *
                  </label>
                  <select
                    id="collector-select"
                    value={assignedCollectorId}
                    onChange={(e) => setAssignedCollectorId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:text-sm"
                    required
                    disabled={updating}
                  >
                    <option value="">-- Choose Collector --</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.vehicleNumber || 'Standard Truck'}) - {c.subCity || 'Addis Ababa'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    disabled={updating}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating || !assignedCollectorId}
                    className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    {updating ? 'Dispatching...' : 'Confirm Dispatch'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
