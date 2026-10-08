import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import { collectionRequestService } from '../../services/collectionRequestService';
import { CollectionRequest } from '../../types';
import { Package, Calendar, MapPin, Clock, Plus, AlertCircle, XCircle } from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await collectionRequestService.getMyRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this collection request?')) return;
    try {
      await collectionRequestService.cancelRequest(id);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel request.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Pending Schedule</span>;
      case 'SCHEDULED':
      case 'ASSIGNED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 font-medium">Assigned to Collector</span>;
      case 'IN_PROGRESS':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">En Route / In Progress</span>;
      case 'COMPLETED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">{status}</span>;
    }
  };

  const filteredRequests = filterStatus === 'ALL'
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  return (
    <CitizenLayout title="My Collection Requests">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Waste Collection Requests</h2>
            <p className="text-sm text-slate-400">Track and manage your doorstep waste pickups.</p>
          </div>
          <Link
            to="/citizen/request-collection"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" /> Book Pickup
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
          {['ALL', 'PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">No collection requests found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">You haven't requested any waste collection matching this filter.</p>
            <Link
              to="/citizen/request-collection"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
            >
              Request Collection Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        {req.wasteType}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        Quantity: {req.estimatedQuantity}
                      </h3>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="space-y-2 text-sm text-slate-300 mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{req.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>Date: {new Date(req.preferredDate).toLocaleDateString()}</span>
                    </div>
                    {req.preferredTime && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>Time: {req.preferredTime}</span>
                      </div>
                    )}
                  </div>

                  {req.notes && (
                    <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl mb-4 border border-slate-700/40">
                      "{req.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    ID: #{req.id.substring(0, 8)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {req.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition text-xs flex items-center gap-1 font-semibold"
                      >
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                    <Link
                      to={`/citizen/requests/${req.id}`}
                      className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CitizenLayout>
  );
};
