import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminService } from '../../services/adminService';
import { collectionRequestService } from '../../services/collectionRequestService';
import { CollectionRequest, User } from '../../types';
import { Truck, MapPin, Calendar, Clock, AlertCircle, UserCheck, CheckCircle2 } from 'lucide-react';

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
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to dispatch collector.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Collection Request Dispatches">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Doorstep Waste Collection Requests</h2>
          <p className="text-sm text-slate-400">Dispatch registered municipal collectors to citizen pickup locations.</p>
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
        ) : requests.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No collection requests in system.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase">
                      {req.wasteType}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-emerald-400 border border-emerald-500/30">
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    Quantity: {req.estimatedQuantity}
                  </h3>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {req.address}
                  </p>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" /> {new Date(req.preferredDate).toLocaleDateString()}
                  </p>

                  {req.assignedCollector ? (
                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 text-xs">
                      <span className="text-slate-400 block mb-0.5">Assigned Collector:</span>
                      <span className="font-bold text-white">{req.assignedCollector.name}</span>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-400 font-semibold">
                      Unassigned - Needs Collector
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setAssignedCollectorId(req.assignedCollectorId || '');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1"
                  >
                    <UserCheck className="w-4 h-4" /> Dispatch / Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Assigning Collector */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-xl font-bold text-white">Dispatch Collector</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
              </div>

              <form onSubmit={handleAssignCollector} className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Pickup Address</span>
                  <p className="text-sm font-bold text-white">{selectedRequest.address}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Collector Fleet Unit *
                  </label>
                  <select
                    value={assignedCollectorId}
                    onChange={(e) => setAssignedCollectorId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Choose Collector --</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.vehicleNumber || 'Standard Truck'}) - {c.subCity || 'Addis Ababa'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Confirm Dispatch
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
