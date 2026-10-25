
import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { centerService } from '../../services/centerService';
import { RecyclingCenter } from '../../types';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import {
  Building2,
  Plus,
  MapPin,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

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

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

  const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-600';

  return (
    <AdminLayout title="Recycling Facilities & Station Management">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Create Form */}
          <div className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                <Plus className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                Register Recycling Facility
              </h2>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Facility added to directory!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Station Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bole Medhanialem Eco Hub"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Street Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Accepted Material Types</label>
                <input
                  type="text"
                  value={acceptedTypes}
                  onChange={(e) => setAcceptedTypes(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Pin Coordinates on Map</label>
                <div className="overflow-hidden rounded-xl border border-slate-200">
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
                <p className="text-xs text-slate-500">
                  Select a location on the map to set the facility coordinates.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {submitting ? 'Creating...' : 'Register Facility'}
              </button>
            </form>
          </div>

          {/* List of Stations */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Directory Stations ({centers.length})
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Registered recycling facilities and their accepted materials.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center rounded-2xl border border-slate-200 bg-white py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
              </div>
            ) : centers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  No recycling stations registered.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {centers.map((center) => (
                  <div
                    key={center.id}
                    className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <h4 className="break-words pt-1 text-base font-bold text-slate-800">
                            {center.name}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(center.id)}
                          aria-label={`Delete ${center.name}`}
                          title="Delete recycling center"
                          className="flex-shrink-0 rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
                        <span>{center.address}</span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-800">
                      <span className="font-semibold">Accepts:</span>{' '}
                      {center.acceptedTypes}
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
