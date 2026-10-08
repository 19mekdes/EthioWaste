import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CitizenLayout } from '../../layouts/CitizenLayout';
import InteractiveMap from '../../components/map/InteractiveMap';
import { ImageUploadField } from '../../components/ui/ImageUploadField';
import { collectionRequestService } from '../../services/collectionRequestService';
import { MapPin, Calendar, Clock, Package, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export const CollectionRequestPage: React.FC = () => {
  const navigate = useNavigate();

  const [wasteType, setWasteType] = useState('PLASTIC');
  const [estimatedQuantity, setEstimatedQuantity] = useState('5kg - 10kg');
  const [address, setAddress] = useState('Bole Sub City, Woreda 03, Addis Ababa');
  const [latitude, setLatitude] = useState(8.9806);
  const [longitude, setLongitude] = useState(38.7578);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) {
      setError('Please select a preferred pickup date.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await collectionRequestService.createRequest({
        wasteType,
        estimatedQuantity,
        address,
        latitude,
        longitude,
        preferredDate,
        preferredTime: preferredTime || '09:00',
        notes,
        photos,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/citizen/my-requests');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit collection request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CitizenLayout title="Request Waste Collection">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-slate-700 pb-4 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-400" /> Book Bulk / Household Pickup
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Schedule a doorstep collection for segregated recyclable waste or bulk household waste.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Collection request submitted successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Waste Type / Category *
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="PLASTIC">Plastic (Bottles, Containers, Packaging)</option>
                  <option value="PAPER_CARD">Paper & Cardboard</option>
                  <option value="GLASS">Glass Bottles & Jars</option>
                  <option value="METAL">Metal & Scrap Metal</option>
                  <option value="ELECTRONIC">E-Waste (Electronics, Batteries)</option>
                  <option value="ORGANIC">Organic / Compostable</option>
                  <option value="MIXED">Mixed Household Waste</option>
                  <option value="HAZARDOUS">Hazardous Household Waste</option>
                </select>
              </div>

              {/* Estimated Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Estimated Quantity *
                </label>
                <input
                  type="text"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  placeholder="e.g. 2 bags, ~15kg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Preferred Pickup Date */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Preferred Date *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Preferred Time Window */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> Preferred Time Window
                </label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> Pickup Address / Landmark *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near Bole Medhanialem Church, House #104"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Interactive Location Selection Map */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pinpoint Pickup Location on Map (Addis Ababa)
              </label>
              <InteractiveMap
                height="320px"
                latitude={latitude}
                longitude={longitude}
                interactive={true}
                onLocationSelect={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
                markers={[
                  {
                    id: 'pickup-location',
                    latitude,
                    longitude,
                    title: 'Selected Pickup Point',
                    description: address,
                  }
                ]}
              />
              <p className="text-xs text-slate-400 mt-2">
                Click anywhere on the map to accurately place the collection pin. Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Special Instructions / Access Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Gate password, gate color, narrow alley details..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Photo Upload */}
            <ImageUploadField
              images={photos}
              onChange={(val: any) => setPhotos(Array.isArray(val) ? val : [val])}
              label="Upload Waste Photos (Optional)"
              maxImages={4}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => navigate('/citizen/my-requests')}
                className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CitizenLayout>
  );
};
