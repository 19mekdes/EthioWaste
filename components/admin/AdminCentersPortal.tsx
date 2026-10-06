'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Trash2, Edit3, Clock, Phone, Tag, CheckCircle2, Loader2, LocateFixed } from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import {
  createRecyclingCenterAdmin,
  updateRecyclingCenterAdmin,
  deleteRecyclingCenterAdmin,
} from '@/actions/admin';

interface AdminCentersPortalProps {
  initialCenters: any[];
}

export function AdminCentersPortal({ initialCenters }: AdminCentersPortalProps) {
  const router = useRouter();

  const [centers, setCenters] = useState(initialCenters);
  const [showModal, setShowModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Bole Road, Addis Ababa');
  const [city, setCity] = useState('Addis Ababa');
  const [lat, setLat] = useState(9.0000);
  const [lng, setLng] = useState(38.7700);
  const [acceptedMaterials, setAcceptedMaterials] = useState('PLASTIC, PAPER, GLASS, CARDBOARD');
  const [contactPhone, setContactPhone] = useState('+251 11 612 3456');
  const [operatingHours, setOperatingHours] = useState('8:00 AM - 6:00 PM (Mon - Sat)');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapMarkers: MapMarker[] = [
    ...centers.map((c) => ({
      id: c.id,
      title: c.name,
      address: c.address,
      latitude: c.latitude,
      longitude: c.longitude,
      acceptedMaterials: c.acceptedMaterials,
      type: 'CENTER' as const,
    })),
    ...(showModal
      ? [
          {
            id: 'new-center-pin',
            title: name || 'New Center Location',
            latitude: lat,
            longitude: lng,
            type: 'NEW_PIN' as const,
          },
        ]
      : []),
  ];

  const handleOpenCreate = () => {
    setEditingCenter(null);
    setName('');
    setDescription('');
    setAddress('Bole Road, Addis Ababa');
    setLat(9.0000);
    setLng(38.7700);
    setAcceptedMaterials('PLASTIC, PAPER, GLASS, CARDBOARD');
    setContactPhone('+251 11 612 3456');
    setOperatingHours('8:00 AM - 6:00 PM (Mon - Sat)');
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCenter(c);
    setName(c.name);
    setDescription(c.description || '');
    setAddress(c.address);
    setCity(c.city || 'Addis Ababa');
    setLat(c.latitude);
    setLng(c.longitude);
    setAcceptedMaterials(c.acceptedMaterials);
    setContactPhone(c.contactPhone || '');
    setOperatingHours(c.operatingHours || '');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !acceptedMaterials) {
      setError('Name, address, and accepted materials are required.');
      return;
    }

    setLoading(true);
    setError('');

    if (editingCenter) {
      const res = await updateRecyclingCenterAdmin(editingCenter.id, {
        name,
        description,
        address,
        city,
        latitude: lat,
        longitude: lng,
        acceptedMaterials,
        contactPhone,
        operatingHours,
      });
      setLoading(false);

      if (res.success && res.center) {
        setCenters((prev) => prev.map((item) => (item.id === editingCenter.id ? res.center : item)));
        setShowModal(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to update center.');
      }
    } else {
      const res = await createRecyclingCenterAdmin({
        name,
        description,
        address,
        city,
        latitude: lat,
        longitude: lng,
        acceptedMaterials,
        contactPhone,
        operatingHours,
      });
      setLoading(false);

      if (res.success && res.center) {
        setCenters((prev) => [res.center, ...prev]);
        setShowModal(false);
        router.refresh();
      } else {
        setError(res.error || 'Failed to create center.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recycling center?')) return;
    setLoading(true);
    const res = await deleteRecyclingCenterAdmin(id);
    setLoading(false);

    if (res.success) {
      setCenters((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Failed to delete center.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-slate-900/60 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            Recycling Centers & Collection Points
          </h1>
          <p className="text-xs text-slate-400">
            Manage municipal drop-off points, operating hours, GPS locations, and accepted recycling materials.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="glass-button-primary text-xs py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Center</span>
        </button>
      </div>

      {/* Map View */}
      <div className="glass-card p-4 space-y-3 border-slate-800 bg-slate-900/60">
        <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Citywide Collection Center Locations</span>
        </div>
        <InteractiveMap
          markers={mapMarkers}
          height="350px"
          centerLat={9.0200}
          centerLng={38.7600}
          zoom={12}
        />
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {centers.map((c) => (
          <div key={c.id} className="glass-card p-5 border-slate-800 bg-slate-900/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <div className="text-xs text-slate-400">{c.address}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {c.description && <p className="text-slate-400 text-[11px]">{c.description}</p>}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Hours: {c.operatingHours || '8:00 AM - 6:00 PM'}</span>
                </div>
                {c.contactPhone && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Phone: {c.contactPhone}</span>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-400" /> Accepted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.acceptedMaterials.split(',').map((mat: string) => (
                      <span key={mat} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {mat.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-500 border-t border-slate-800/40 flex justify-between">
              <span>GPS: {c.latitude}, {c.longitude}</span>
              <span>Status: {c.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card p-6 max-w-lg w-full border-amber-500/30 my-auto space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingCenter ? 'Edit Recycling Center' : 'Add New Recycling Center'}
            </h3>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Center Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bole Eco-Recycling Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Address Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bole Road near Atlas, Addis Ababa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full glass-input"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full glass-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Accepted Materials (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. PLASTIC, GLASS, PAPER, METAL"
                  value={acceptedMaterials}
                  onChange={(e) => setAcceptedMaterials(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    placeholder="8:00 AM - 6:00 PM"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+251 11 612 3456"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="glass-button-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary text-xs bg-amber-500 text-slate-950 font-bold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Center'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
