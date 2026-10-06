'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertOctagon,
  CheckCircle2,
  Loader2,
  LocateFixed,
  Send,
} from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { createCollectionRequest } from '@/actions/collection-requests';
import { WasteCategory, ReportSeverity } from '@prisma/client';

export function CollectionRequestForm() {
  const router = useRouter();

  const [wasteType, setWasteType] = useState<WasteCategory>('MIXED');
  const [estimatedQuantity, setEstimatedQuantity] = useState('2-3 Large Bags (~15kg)');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Kazanchis Residence, Addis Ababa');
  const [lat, setLat] = useState(9.0200);
  const [lng, setLng] = useState(38.7600);
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (8:00 AM - 12:00 PM)');
  const [priority, setPriority] = useState<ReportSeverity>('MEDIUM');

  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const mapMarkers: MapMarker[] = [
    {
      id: 'pickup-loc-pin',
      title: 'Collection Pickup Point',
      latitude: lat,
      longitude: lng,
      type: 'NEW_PIN',
    },
  ];

  const handleUseMyLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device. Pin the location on the map instead.');
      return;
    }

    setLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(Math.round(latitude * 10000) / 10000);
        setLng(Math.round(longitude * 10000) / 10000);
        setAddress(`GPS Pickup Point (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocating(false);
        setError('Could not access GPS. Pin your pickup location on the map instead.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a pickup location address.');
      return;
    }
    if (!preferredDate) {
      setError('Please select a preferred collection date.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createCollectionRequest({
      wasteType,
      estimatedQuantity,
      description,
      address,
      latitude: lat,
      longitude: lng,
      preferredDate,
      preferredTimeSlot,
      priority,
    });

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        router.push('/dashboard/citizen/requests');
      }, 2000);
    } else {
      setError(res.error || 'Failed to submit request.');
    }
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto border-sky-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Schedule Waste Collection Request</h2>
          <p className="text-xs text-slate-400">Request bulk pickup directly from your doorstep or commercial venue</p>
        </div>
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Collection Request Submitted!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Your request status is set to <span className="font-bold text-amber-400">PENDING</span>.
            Municipal dispatch will verify your request and assign a licensed waste collector shorty.
          </p>
          <p className="text-xs text-slate-400">Redirecting to your request tracking dashboard...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Waste Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                Waste Category
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value as WasteCategory)}
                className="w-full glass-input"
              >
                <option value="MIXED">Mixed Household Waste</option>
                <option value="PLASTIC">Plastic & Rubber</option>
                <option value="PAPER">Paper & Documents</option>
                <option value="CARDBOARD">Cardboard & Packaging</option>
                <option value="GLASS">Glass Bottles & Jars</option>
                <option value="METAL">Scrap Metal & Cans</option>
                <option value="ELECTRONIC">E-Waste & Appliances</option>
                <option value="ORGANIC">Organic & Garden Waste</option>
                <option value="HAZARDOUS">Hazardous / Special Handling</option>
                <option value="OTHER">Other Bulk Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-400" />
                Estimated Volume / Quantity
              </label>
              <input
                type="text"
                placeholder="e.g. 3 Bags (~20kg), 1 Dumpster, 5 Cartons"
                value={estimatedQuantity}
                onChange={(e) => setEstimatedQuantity(e.target.value)}
                className="w-full glass-input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes / Access Instructions</label>
            <textarea
              rows={2}
              placeholder="e.g. Gate code, basement entrance, or specific pickup instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input"
            />
          </div>

          {/* Preferred Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Preferred Time Slot
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full glass-input"
              >
                <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ReportSeverity)}
              className="w-full glass-input"
            >
              <option value="LOW">Low (Flexible schedule)</option>
              <option value="MEDIUM">Medium (Standard 24-48h turnaround)</option>
              <option value="HIGH">High (Urgent - within 24 hours)</option>
              <option value="CRITICAL">Critical (Immediate hazard removal)</option>
            </select>
          </div>

          {/* Geolocation & Map */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Pickup Location Address & GPS Coordinates
            </label>

            <input
              type="text"
              placeholder="Full address or street name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full glass-input mb-2"
              required
            />

            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="glass-button-secondary text-xs py-2 flex-1"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Detecting Location...' : 'Use My GPS Location'}</span>
              </button>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              centerLat={lat}
              centerLng={lng}
              height="200px"
              zoom={14}
              onLocationSelect={(loc) => {
                setLat(Math.round(loc.lat * 10000) / 10000);
                setLng(Math.round(loc.lng * 10000) / 10000);
                setAddress(`Pickup Location (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
              }}
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex justify-end">
            <button type="submit" disabled={loading} className="glass-button-primary text-xs w-full sm:w-auto px-6 py-2.5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Collection Request</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
