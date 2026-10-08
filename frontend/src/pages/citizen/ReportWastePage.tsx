import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { WasteCategory, ReportSeverity } from '../../types';
import { ImageUploadField } from '../../components/ui/ImageUploadField';
import InteractiveMap, { MapMarker } from '../../components/map/InteractiveMap';
import {
  MapPin,
  LocateFixed,
  Send,
  Loader2,
  CheckCircle2,
  AlertOctagon,
  Tag,
} from 'lucide-react';

const sampleImages = [
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
];

export const ReportWastePage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WasteCategory>('PLASTIC');
  const [severity, setSeverity] = useState<ReportSeverity>('MEDIUM');
  const [imageUrl, setImageUrl] = useState(sampleImages[0]);
  const [lat, setLat] = useState(8.9806);
  const [lng, setLng] = useState(38.7578);
  const [address, setAddress] = useState('Bole Sub City, Addis Ababa');
  const [isIllegalDumping, setIsIllegalDumping] = useState(false);

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Math.round(pos.coords.latitude * 10000) / 10000);
        setLng(Math.round(pos.coords.longitude * 10000) / 10000);
        setAddress(`GPS Location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setLocating(false);
      },
      (err) => {
        console.error(err);
        setLocating(false);
        setError('Unable to retrieve current location. Defaulting to Addis Ababa city center.');
      }
    );
  };

  const mapMarkers = useMemo<MapMarker[]>(() => {
    return [
      {
        id: 'new-report-pin',
        title: title || 'New Report Location',
        category,
        severity,
        status: 'NEW',
        latitude: lat,
        longitude: lng,
        type: 'NEW_PIN',
        address,
      },
    ];
  }, [title, category, severity, lat, lng, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await reportService.createReport({
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

      setSubmitted(true);
      setTimeout(() => navigate('/citizen/my-reports'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto border-emerald-500/30 relative rounded-2xl bg-slate-900/80">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
          🚨
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Report Waste Issue / Illegal Dumping</h2>
          <p className="text-xs text-slate-400">Submit overflowing bins or illegal dumping in Addis Ababa to earn Eco-Points</p>
        </div>
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Report Successfully Submitted!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Thank you for helping keep Addis Ababa clean! Municipal Admins will validate your report, and you will earn +50 Eco-Points once approved.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Overflowing plastic bin near Bole Medhanealem"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
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
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                required
              />
            </div>
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Waste Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WasteCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
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
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
              >
                <option value="LOW">Low (Minor littering)</option>
                <option value="MEDIUM">Medium (Full bin)</option>
                <option value="HIGH">High (Overflowing onto sidewalk)</option>
                <option value="CRITICAL">Critical (Hazardous/Traffic hazard)</option>
              </select>
            </div>
          </div>

          <ImageUploadField
            label="Waste Issue Photo"
            value={imageUrl}
            onChange={setImageUrl}
            presets={sampleImages}
            previewHeight="h-36"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Pin GPS Location (Addis Ababa)
            </label>

            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs flex items-center justify-center gap-1.5 text-slate-200"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Detecting Location...' : 'Use My Current Location (GPS)'}</span>
              </button>
              <p className="text-[11px] text-slate-500 sm:self-center">or click anywhere on the map to set coordinates</p>
            </div>

            <InteractiveMap
              markers={mapMarkers}
              centerLat={lat}
              centerLng={lng}
              height="220px"
              zoom={14}
              onLocationSelect={(latitude, longitude) => {
                setLat(Math.round(latitude * 10000) / 10000);
                setLng(Math.round(longitude * 10000) / 10000);
                setAddress(`Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }}
            />

            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>Pinned: {address}</span>
              <span className="font-mono text-emerald-400">
                {lat}, {lng}
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Issue Report</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportWastePage;
