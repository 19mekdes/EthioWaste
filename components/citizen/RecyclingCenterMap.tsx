'use client';

import React, { useState } from 'react';
import InteractiveMap, { MapMarker } from '@/components/map/InteractiveMap';
import { MapPin, Phone, Clock, Filter, Navigation, Recycle } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';

export interface RecyclingCenterData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: string;
  contactPhone?: string | null;
  operatingHours?: string | null;
}

interface RecyclingCenterMapProps {
  centers: RecyclingCenterData[];
  userLat?: number;
  userLng?: number;
}

export function RecyclingCenterMap({
  centers,
  userLat = 40.7580,
  userLng = -73.9855,
}: RecyclingCenterMapProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');
  const [selectedCenterId, setSelectedCenterId] = useState<string | undefined>(undefined);

  const materialsList = ['ALL', 'Plastics', 'E-Waste', 'Glass', 'Batteries', 'Organic', 'Hazardous', 'Metals'];

  const filteredCenters = centers.filter((c) => {
    if (selectedMaterial === 'ALL') return true;
    return c.acceptedMaterials.toLowerCase().includes(selectedMaterial.toLowerCase());
  });

  const markers: MapMarker[] = filteredCenters.map((c) => ({
    id: c.id,
    title: c.name,
    address: c.address,
    latitude: c.latitude,
    longitude: c.longitude,
    type: 'CENTER',
    acceptedMaterials: c.acceptedMaterials,
    operatingHours: c.operatingHours || undefined,
  }));

  return (
    <div className="space-y-6">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Nearby Recycling Centers & Drop Hubs
          </h2>
          <p className="text-xs text-slate-400">Locate certified recycling drop-off centers filterable by material</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {materialsList.map((mat) => (
            <button
              key={mat}
              onClick={() => setSelectedMaterial(mat)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap font-medium ${
                selectedMaterial === mat
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Column */}
        <div className="lg:col-span-2">
          <InteractiveMap
            markers={markers}
            selectedMarkerId={selectedCenterId}
            onMarkerClick={(m) => setSelectedCenterId(m.id)}
            height="540px"
            centerLat={userLat}
            centerLng={userLng}
            zoom={12}
          />
        </div>

        {/* Directory Listing Column */}
        <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Found {filteredCenters.length} Facilities
          </div>

          {filteredCenters.map((center) => {
            const dist = calculateDistance(userLat, userLng, center.latitude, center.longitude);
            const isSelected = center.id === selectedCenterId;

            return (
              <div
                key={center.id}
                onClick={() => setSelectedCenterId(center.id)}
                className={`glass-card p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{center.name}</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    {dist} km
                  </span>
                </div>

                <div className="text-xs text-slate-400 space-y-1.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{center.address}</span>
                  </div>
                  {center.operatingHours && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{center.operatingHours}</span>
                    </div>
                  )}
                  {center.contactPhone && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{center.contactPhone}</span>
                    </div>
                  )}
                </div>

                {/* Material Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  {center.acceptedMaterials.split(',').map((mat) => (
                    <span
                      key={mat}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                    >
                      {mat.trim()}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
