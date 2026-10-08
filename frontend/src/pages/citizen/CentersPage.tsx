import React, { useEffect, useState } from 'react';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import InteractiveMap from '../../components/map/InteractiveMap';
import { centerService } from '../../services/centerService';
import { RecyclingCenter } from '../../types';
import { Building2, MapPin, Phone, Clock, Search, AlertCircle } from 'lucide-react';

export const CentersPage: React.FC = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const data = await centerService.getAllCenters();
        setCenters(Array.isArray(data) ? data : (data as any)?.data || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load recycling centers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      (c.acceptedTypes || c.acceptedMaterials || '').toLowerCase().includes(search.toLowerCase())
  );

  const markers = filteredCenters.map((c) => ({
    id: c.id,
    latitude: c.latitude,
    longitude: c.longitude,
    title: c.name,
    description: `${c.address} | Accepts: ${c.acceptedTypes || c.acceptedMaterials || 'Recyclables'}`,
  }));

  return (
    <CitizenLayout title="Recycling Centers & Drop-off Hubs">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Addis Ababa Recycling Facilities</h2>
            <p className="text-sm text-slate-400">Find nearby drop-off stations and material recovery facilities.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by sub-city, material..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Map View */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-3">Facility Locations Map</h3>
          <InteractiveMap
            height="360px"
            latitude={8.9806}
            longitude={38.7578}
            zoom={12}
            markers={markers}
          />
        </div>

        {/* Centers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
            No recycling centers found matching your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center) => (
              <div
                key={center.id}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl p-6 shadow-lg flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{center.name}</h4>
                      <span className="text-xs text-emerald-400 font-medium">Verified Station</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{center.address}</span>
                    </div>
                    {(center.phone || center.contactPhone) && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        <span>{center.phone || center.contactPhone}</span>
                      </div>
                    )}
                    {center.operatingHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{center.operatingHours}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                      Accepted Materials
                    </span>
                    <p className="text-xs font-medium text-emerald-300">{center.acceptedTypes || center.acceptedMaterials || 'General Recyclables'}</p>
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
