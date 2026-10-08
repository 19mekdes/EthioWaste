import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { collectionRequestService } from '../../services/collectionRequestService';
import { CollectionRequest } from '../../types';
import { ArrowLeft, MapPin, Calendar, Clock, Package, AlertCircle, User, CheckCircle2 } from 'lucide-react';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [request, setRequest] = useState<CollectionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await collectionRequestService.getRequestById(id);
        setRequest(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load request details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <CitizenLayout title="Request Details">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
      </CitizenLayout>
    );
  }

  if (error || !request) {
    return (
      <CitizenLayout title="Request Details">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error || 'Request not found.'}</span>
          </div>
          <button
            onClick={() => navigate('/citizen/my-requests')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Requests
          </button>
        </div>
      </CitizenLayout>
    );
  }

  return (
    <CitizenLayout title={`Request #${request.id.substring(0, 8)}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/citizen/my-requests')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection Requests
        </button>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {request.wasteType} Waste Pickup
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">
                Estimated Quantity: {request.estimatedQuantity}
              </h1>
            </div>
            <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-slate-700 text-emerald-400 border border-emerald-500/30">
              {request.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pickup Information</h3>
              
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Address</span>
                    <span className="font-medium text-white">{request.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Preferred Date</span>
                    <span className="font-medium text-white">{new Date(request.preferredDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-xs block">Preferred Time</span>
                    <span className="font-medium text-white">{request.preferredTime || 'Anytime'}</span>
                  </div>
                </div>

                {request.notes && (
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-xs block mb-1">Notes / Instructions</span>
                    <p className="text-slate-200 text-sm">{request.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Assigned Dispatch</h3>
              {request.assignedCollector ? (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{request.assignedCollector.name}</h4>
                      <p className="text-xs text-slate-400">Vehicle: {request.assignedCollector.vehicleNumber || 'Standard Truck'}</p>
                      <p className="text-xs text-slate-400">Phone: {request.assignedCollector.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 text-slate-400 text-sm">
                  Pending dispatch assignment by Municipal Admin.
                </div>
              )}
            </div>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Map Location</h3>
            <InteractiveMap
              height="280px"
              latitude={request.latitude}
              longitude={request.longitude}
              markers={[
                {
                  id: request.id,
                  latitude: request.latitude,
                  longitude: request.longitude,
                  title: `${request.wasteType} Pickup`,
                  description: request.address,
                }
              ]}
            />
          </div>

          {/* Photo Gallery if present */}
          {request.photos && request.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Attached Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {request.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-xl border border-slate-700"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
};
