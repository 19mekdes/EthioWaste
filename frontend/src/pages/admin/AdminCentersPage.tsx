import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { centerService } from '../../services/centerService';
import { RecyclingCenter } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { Building2, Plus, MapPin, Phone, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminCentersPage: React.FC = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('Bole Sub City, Addis Ababa');
  const [latitude, setLatitude] = useState(8.9806);
  const [longitude, setLongitude] = useState(38.7578);
  const [acceptedTypes, setAcceptedTypes] = useState('Plastic, Glass, Metal, E-Waste');
  const [operatingHours, setOperatingHours] = useState('Mon - Sat: 8:00 AM - 6:00 PM');
  const [phone, setPhone] = useState('+251 11 654 3210');

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await centerService.getAllCenters();
      setCenters(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch recycling centers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    try {
      setSubmitting(true);
      setError(null);
      await centerService.createCenter({
        name,
        address,
        latitude,
        longitude,
        acceptedTypes,
        operatingHours,
        phone,
      });

      setSuccess(true);
      setName('');
      fetchCenters();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create recycling station.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this recycling center from directory?')) return;
    try {
      await centerService.deleteCenter(id);
      fetchCenters();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete center.');
    }
  };

  return (
    <AdminLayout title="Recycling Facilities & Station Management">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl h-fit">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-emerald-400" /> Register Recycling Facility
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Facility added to directory!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Station Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bole Medhanialem Eco Hub"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accepted Material Types</label>
                <input
                  type="text"
                  value={acceptedTypes}
                  onChange={(e) => setAcceptedTypes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pin Coordinates on Map</label>
                <InteractiveMap
                  height="200px"
                  latitude={latitude}
                  longitude={longitude}
                  interactive={true}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg"
              >
                {submitting ? 'Creating...' : 'Register Facility'}
              </button>
            </form>
          </div>

          {/* List of Stations */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white">Directory Stations ({centers.length})</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              </div>
            ) : centers.length === 0 ? (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center text-slate-400 text-sm">
                No recycling stations registered.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {centers.map((center) => (
                  <div
                    key={center.id}
                    className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-base">{center.name}</h4>
                        <button
                          onClick={() => handleDelete(center.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {center.address}
                      </p>

                      <div className="mt-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/40 text-[11px] text-emerald-300">
                        Accepts: {center.acceptedTypes}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
