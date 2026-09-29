'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Truck, CheckCircle2, Loader2, X } from 'lucide-react';
import { createPickupSchedule } from '@/actions/pickups';
import { WasteCategory } from '@prisma/client';

interface PickupScheduleFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function PickupScheduleForm({ onSuccess, onClose }: PickupScheduleFormProps) {
  const [wasteType, setWasteType] = useState<WasteCategory>('BULK');
  const [address, setAddress] = useState('350 W 57th St, Apt 14B, New York, NY 10019');
  const [scheduledDate, setScheduledDate] = useState('2026-08-05');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Morning (9:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    'Morning (9:00 AM - 12:00 PM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (5:00 PM - 8:00 PM)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !scheduledDate) {
      setError('Please provide address and scheduled date');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createPickupSchedule({
      wasteType,
      address,
      latitude: 40.7680,
      longitude: -73.9850,
      scheduledDate,
      preferredTimeSlot,
      notes,
    });

    setLoading(false);

    if (res.success) {
      setSubmitted(true);
      if (onSuccess) setTimeout(onSuccess, 1500);
    } else {
      setError(res.error || 'Failed to schedule pickup');
    }
  };

  return (
    <div className="glass-card p-6 max-w-xl mx-auto border-sky-500/30 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
          🚚
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Schedule Bulk Waste Pickup</h2>
          <p className="text-xs text-slate-400">Book door-to-door bulk waste and e-waste collection</p>
        </div>
      </div>

      {submitted ? (
        <div className="py-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Pickup Booked Successfully!</h3>
          <p className="text-sm text-slate-300">
            Our municipal collection crew will arrive on <span className="text-emerald-400 font-semibold">{scheduledDate}</span> during <span className="text-sky-400 font-semibold">{preferredTimeSlot}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Waste Type</label>
            <select
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value as any)}
              className="w-full glass-input"
            >
              <option value="BULK">Bulk Furniture & Mattresses</option>
              <option value="E_WASTE">E-Waste & Appliances</option>
              <option value="HAZARDOUS">Batteries & Household Chemicals</option>
              <option value="ORGANIC">Yard Trimmings & Large Organics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Pickup Location / Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address, unit, zip code"
              className="w-full glass-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Preferred Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full glass-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Time Slot
              </label>
              <select
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full glass-input"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Access Notes / Item Details</label>
            <textarea
              rows={2}
              placeholder="e.g. Leave near driveway gate; 2 mattresses and a sofa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            {onClose && (
              <button type="button" onClick={onClose} className="glass-button-secondary text-xs">
                Cancel
              </button>
            )}
            <button type="submit" disabled={loading} className="glass-button-primary text-xs w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              <span>Confirm Pickup Booking</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
