'use client';

import React, { useState } from 'react';
import { MapPin, AlertOctagon, Tag, CheckCircle2, Loader2, X, LocateFixed, Send } from 'lucide-react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { createWasteReport } from '@/actions/reports';
import { ImageUploadField } from '@/components/ui/ImageUploadField';
import { WasteCategory, ReportSeverity } from '@prisma/client';

interface ReportWasteFormProps {
  userId?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const sampleImages = [
  { label: 'Plastic Waste', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80' },
  { label: 'E-Waste Pile', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80' },
  { label: 'Chemical Drums', url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Overflowing Bin', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
];

export function ReportWasteForm({ onSuccess, onClose }: ReportWasteFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WasteCategory>('PLASTIC');
  const [severity, setSeverity] = useState<ReportSeverity>('HIGH');
  const [imageUrl, setImageUrl] = useState('');
  const [lat, setLat] = useState(8.9950);
  const [lng, setLng] = useState(38.7860);
  const [address, setAddress] = useState('Bole Medhanealem Plaza, Addis Ababa');
  const [isIllegalDumping, setIsIllegalDumping] = useState(false);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const mapMarkers: MapMarker[] = [
    {
      id: 'new-report-pin',
      title: title || 'Selected Waste Location',
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
        setAddress(`GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        setLocating(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocating(false);
        setError('Could not access your location. Pin it on the map instead.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Please fill in the title and issue description');
      return;
    }
    if (!imageUrl) {
      setError('Please attach a photo of the waste issue (or pick a sample photo).');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createWasteReport({
      title,
      description,
      category,
      severity,
      imageUrl,
      latitude: lat,
      longitude: lng,
      address,
      isIllegalDumping,
    });

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      if (onSuccess) setTimeout(onSuccess, 1500);
    } else {
      setError(res.error || 'Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto border-emerald-500/30 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
          🚨
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Report Waste Issue / Illegal Dumping</h2>
          <p className="text-xs text-slate-400">Submit overflowing bins or illegal dumping to earn Eco-Points</p>
        </div>
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Report Successfully Submitted!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Thank you for helping keep our community clean! Municipal Admins will validate your report, and you will earn +50 Eco-Points once approved.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Overflowing plastic bin near Bole Plaza"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Describe the severity, hazardous items, or obstruction details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full glass-input"
                required
              />
            </div>
          </div>

          {/* Illegal Dumping Checkbox */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="illegalDumping"
              checked={isIllegalDumping}
              onChange={(e) => setIsIllegalDumping(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500"
            />
            <label htmlFor="illegalDumping" className="text-xs font-medium text-slate-200 cursor-pointer">
              Report as Illegal Dumping Site (High priority response)
            </label>
          </div>

          {/* Category & Severity Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Waste Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WasteCategory)}
                className="w-full glass-input"
              >
                <option value="PLASTIC">Plastic & Bottles</option>
                <option value="PAPER">Paper</option>
                <option value="CARDBOARD">Cardboard & Packaging</option>
                <option value="GLASS">Glass</option>
                <option value="METAL">Metal & Aluminum</option>
                <option value="ELECTRONIC">Electronic Waste (E-Waste)</option>
                <option value="ORGANIC">Organic & Food Waste</option>
                <option value="HAZARDOUS">Hazardous & Chemical</option>
                <option value="MIXED">Mixed Municipal Waste</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                className="w-full glass-input"
              >
                <option value="LOW">Low (Minor littering)</option>
                <option value="MEDIUM">Medium (Full bin)</option>
                <option value="HIGH">High (Overflowing onto sidewalk)</option>
                <option value="CRITICAL">Critical (Hazardous/Traffic hazard)</option>
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <ImageUploadField
            label="Waste Issue Photo"
            value={imageUrl}
            onChange={setImageUrl}
            presets={sampleImages}
            previewHeight="h-36"
          />

          {/* Geolocation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Pin GPS Location
            </label>

            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="glass-button-secondary text-xs py-2 flex-1"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Detecting Location...' : 'Use My Current Location (GPS)'}</span>
              </button>
              <p className="text-[11px] text-slate-500 sm:self-center">or click anywhere on the map to set exact coordinates</p>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              centerLat={lat}
              centerLng={lng}
              height="220px"
              zoom={14}
              onLocationSelect={(loc) => {
                setLat(Math.round(loc.lat * 10000) / 10000);
                setLng(Math.round(loc.lng * 10000) / 10000);
                setAddress(`Coordinates: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
              }}
            />

            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Pinned: {address}</span>
              <span className="font-mono text-emerald-400">
                {lat}, {lng}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            {onClose && (
              <button type="button" onClick={onClose} className="glass-button-secondary text-xs">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading} className="glass-button-primary text-xs w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Issue Report</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
